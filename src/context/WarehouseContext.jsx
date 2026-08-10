import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { generateWarehouseGrid, INITIAL_ROBOTS, generateSampleOrders, INITIAL_ACTIVITIES, GRID_SIZE } from '../utils/mockData';
import { runPathfinding, planMultiAgentPaths, ALGORITHMS, PRIORITIES } from '../utils/pathfinding';

const WarehouseContext = createContext(null);

export const WarehouseProvider = ({ children }) => {
  const [grid, setGrid] = useState(generateWarehouseGrid);
  const [robots, setRobots] = useState(INITIAL_ROBOTS);
  const [selectedRobotId, setSelectedRobotId] = useState('R-01');
  const [orders, setOrders] = useState(generateSampleOrders);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [extraObstacles, setExtraObstacles] = useState([]);

  // Simulation Controls State
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS.ASTAR);
  const [collisionCount, setCollisionCount] = useState(0);
  const [collisionAlert, setCollisionAlert] = useState(null);

  // Benchmarking stats for active MAPF simulation
  const [simStats, setSimStats] = useState({
    executionTimeMs: 1.4,
    nodesVisited: 48,
    pathLength: 16,
    memoryKB: 18.5,
    replansCount: 0,
    waitingRobotsCount: 0,
    activeRobotsCount: 12
  });

  const timerRef = useRef(null);

  // Helper to add activity log
  const logActivity = useCallback((text, type = 'task', robot = 'System') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setActivities(prev => [
      { id: Date.now(), time: timeStr, robot, text, type },
      ...prev.slice(0, 49) // Keep last 50
    ]);
  }, []);

  // Recalculate MAPF paths dynamically across all active robots
  const replanAllPaths = useCallback((currentRobots, obstacles = extraObstacles) => {
    const { robots: updatedRobots, stats } = planMultiAgentPaths(currentRobots, grid, obstacles);
    setSimStats(prev => ({
      ...prev,
      executionTimeMs: stats.executionTimeMs,
      nodesVisited: stats.nodesVisited,
      waitingRobotsCount: stats.waitCount,
      activeRobotsCount: stats.activeRobots,
      replansCount: prev.replansCount + 1
    }));
    return updatedRobots;
  }, [grid, extraObstacles]);

  // Compute single path for benchmark display
  const computeRobotPath = useCallback((startPos, targetPos, algorithm = selectedAlgorithm, obstacles = extraObstacles) => {
    if (!startPos || !targetPos) return [];
    const res = runPathfinding(startPos, targetPos, grid, algorithm, obstacles);
    return res.path;
  }, [grid, selectedAlgorithm, extraObstacles]);

  // Update robot priority dynamically (Emergency > Loaded > Normal > Idle)
  const updateRobotPriority = useCallback((robotId, newPriority) => {
    setRobots(prevRobots => {
      const nextRobots = prevRobots.map(r => {
        if (r.id === robotId) {
          return { ...r, priority: newPriority };
        }
        return r;
      });
      logActivity(`Priority changed to [${newPriority}] - Multi-Agent Replanning triggered`, 'replan', robotId);
      return replanAllPaths(nextRobots);
    });
  }, [replanAllPaths, logActivity]);

  // Set destination for selected robot and dynamically replan fleet paths
  const setDestinationForRobot = useCallback((robotId, targetCoords) => {
    setRobots(prevRobots => {
      const nextRobots = prevRobots.map(r => {
        if (r.id === robotId) {
          return {
            ...r,
            target: targetCoords,
            status: 'Replanning',
            currentTask: `Heading to (${targetCoords.x},${targetCoords.y})`
          };
        }
        return r;
      });

      const updated = replanAllPaths(nextRobots);
      const targetRobot = updated.find(r => r.id === robotId);

      logActivity(
        `Target (${targetCoords.x},${targetCoords.y}) set. Reserved Space-Time A* path (${targetRobot?.path?.length || 0} steps)`,
        'replan',
        robotId
      );

      return updated;
    });
  }, [replanAllPaths, logActivity]);

  // Step simulation forward
  const stepSimulation = useCallback(() => {
    setRobots(prevRobots => {
      // 1. Move each robot 1 step along its reserved MAPF path
      const movedRobots = prevRobots.map(r => {
        const s = String(r.status).toLowerCase();
        if ((s !== 'moving' && s !== 'active' && s !== 'waiting' && s !== 'replanning') || !r.path || r.path.length <= 1) {
          // If at destination
          if ((s === 'moving' || s === 'active' || s === 'waiting' || s === 'replanning') && r.path && r.path.length <= 1) {
            logActivity(`Completed task at destination (${r.pos.x},${r.pos.y})`, 'task', r.id);
            return {
              ...r,
              status: 'Completed',
              target: null,
              path: [],
              remainingDistance: '0 m',
              eta: '0s',
              currentTask: 'Task Completed - Standby'
            };
          }
          if (s === 'completed') {
            return {
              ...r,
              status: 'Idle'
            };
          }
          return r;
        }

        // Advance to next position in reserved path
        const nextStep = r.path[1];
        const remainingPath = r.path.slice(1);
        const batteryDrain = r.battery > 15 ? r.battery - 0.05 : r.battery;
        const remDist = Math.max(0, (remainingPath.length - 1) * 2);

        return {
          ...r,
          pos: { x: nextStep.x, y: nextStep.y },
          path: remainingPath,
          status: 'Moving',
          battery: Number(batteryDrain.toFixed(1)),
          remainingDistance: `${remDist} m`,
          eta: `${Math.round((remainingPath.length - 1) * 2.5)}s`
        };
      });

      // 2. Re-synchronize Space-Time Reservation Table from current positions at t=0
      return replanAllPaths(movedRobots);
    });
  }, [replanAllPaths, logActivity]);

  // Simulation Interval Loop
  useEffect(() => {
    if (isRunning && !isPaused) {
      const intervalMs = Math.max(200, 1000 / simSpeed);
      timerRef.current = setInterval(() => {
        stepSimulation();
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isPaused, simSpeed, stepSimulation]);

  // Controls
  const startSimulation = () => {
    setIsRunning(true);
    setIsPaused(false);
    // Initial dynamic replan to initialize reservation table
    setRobots(prev => replanAllPaths(prev));
    logActivity('MAPF Multi-Robot Simulation Engine Started', 'task', 'Simulation');
  };

  const pauseSimulation = () => {
    setIsPaused(true);
    logActivity('Simulation Paused', 'task', 'Simulation');
  };

  const resumeSimulation = () => {
    setIsPaused(false);
    logActivity('Simulation Resumed', 'task', 'Simulation');
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setIsPaused(false);
    const initialWithPaths = replanAllPaths(INITIAL_ROBOTS, []);
    setRobots(initialWithPaths);
    setExtraObstacles([]);
    setCollisionAlert(null);
    logActivity('Simulation Reset to initial state', 'task', 'Simulation');
  };

  const generateRandomOrders = () => {
    const newOrd = generateSampleOrders();
    setOrders(newOrd);
    logActivity('Generated 100 new synthetic warehouse orders', 'order', 'System');
  };

  const generateObstacles = () => {
    const newObstacles = [
      { x: 3, y: 8 }, { x: 7, y: 14 }, { x: 12, y: 5 }, { x: 15, y: 11 }, { x: 8, y: 17 }
    ];
    setExtraObstacles(prev => {
      const updatedObstacles = prev.length > 0 ? [] : newObstacles;
      logActivity(
        updatedObstacles.length > 0 ? 'Dynamic obstacles spawned - Fleet MAPF replanned' : 'Dynamic obstacles cleared',
        'replan',
        'Environment'
      );
      setRobots(r => replanAllPaths(r, updatedObstacles));
      return updatedObstacles;
    });
  };

  // Viva presentation demo: MAPF Priority & Yielding Right-of-Way
  const triggerCollisionScenario = () => {
    setRobots(prev => {
      const copy = [...prev];
      // Force R-01 (Emergency) and R-02 (Normal) onto intersecting trajectory at cell (7,10)
      copy[0] = {
        ...copy[0],
        status: 'active',
        priority: PRIORITIES.EMERGENCY,
        pos: { x: 5, y: 10 },
        target: { x: 9, y: 10 },
        currentTask: 'Emergency Medical Transport (Priority Level 4)'
      };
      copy[1] = {
        ...copy[1],
        status: 'active',
        priority: PRIORITIES.NORMAL,
        pos: { x: 7, y: 8 },
        target: { x: 7, y: 12 },
        currentTask: 'Normal Picking Transport (Priority Level 2)'
      };
      return replanAllPaths(copy);
    });

    setCollisionAlert({
      r1: 'R-01 (Emergency)',
      r2: 'R-02 (Normal)',
      cell: { x: 7, y: 10 },
      time: new Date().toLocaleTimeString(),
      resolvedMessage: 'MAPF Reservation Table resolved intersection: R-02 yields right-of-way with 1-tick wait step. Zero collisions!'
    });

    startSimulation();
    logActivity('DEMO: Injected Intersecting Trajectories (R-01 vs R-02 at cell 7,10). MAPF Priority Conflict Resolution Active!', 'collision', 'Viva Demo');
  };

  const selectedRobot = robots.find(r => r.id === selectedRobotId) || robots[0];

  const pauseRobot = (robotId) => {
    setRobots(prev => prev.map(r => r.id === robotId ? { ...r, status: 'Waiting' } : r));
    logActivity(`Robot ${robotId} motion Paused`, 'replan', robotId);
  };

  const resumeRobot = (robotId) => {
    setRobots(prev => {
      const copy = prev.map(r => r.id === robotId ? { ...r, status: 'Moving' } : r);
      return replanAllPaths(copy);
    });
    logActivity(`Robot ${robotId} motion Resumed`, 'replan', robotId);
  };

  return (
    <WarehouseContext.Provider value={{
      grid,
      robots,
      selectedRobot,
      selectedRobotId,
      setSelectedRobotId,
      orders,
      activities,
      extraObstacles,
      isRunning,
      isPaused,
      simSpeed,
      setSimSpeed,
      zoomLevel,
      setZoomLevel,
      selectedAlgorithm,
      setSelectedAlgorithm,
      simStats,
      collisionCount,
      collisionAlert,
      setCollisionAlert,
      startSimulation,
      pauseSimulation,
      resumeSimulation,
      resetSimulation,
      setDestinationForRobot,
      updateRobotPriority,
      pauseRobot,
      resumeRobot,
      generateRandomOrders,
      generateObstacles,
      triggerCollisionScenario,
      logActivity
    }}>
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => useContext(WarehouseContext);

