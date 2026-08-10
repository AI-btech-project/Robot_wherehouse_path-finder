export const GRID_SIZE = 20;

// Grid cell types
export const CELL_TYPES = {
  EMPTY: 'empty',
  SHELF: 'shelf',
  CHARGING: 'charging',
  PACKING: 'packing',
  DELIVERY: 'delivery',
  OBSTACLE: 'obstacle'
};

// Generate 20x20 Default Warehouse Layout Map
export const generateWarehouseGrid = () => {
  const grid = Array(GRID_SIZE).fill(null).map((_, r) =>
    Array(GRID_SIZE).fill(null).map((_, c) => ({
      x: c,
      y: r,
      type: CELL_TYPES.EMPTY,
      label: ''
    }))
  );

  // Shelves Layout (A, B, C, D blocks)
  // Shelf A
  for (let r = 3; r <= 6; r++) {
    for (let c = 2; c <= 4; c++) {
      grid[r][c] = { x: c, y: r, type: CELL_TYPES.SHELF, label: `A-${r - 2}${c - 1}` };
    }
    for (let c = 6; c <= 8; c++) {
      grid[r][c] = { x: c, y: r, type: CELL_TYPES.SHELF, label: `B-${r - 2}${c - 5}` };
    }
  }

  // Shelf C & D
  for (let r = 10; r <= 13; r++) {
    for (let c = 2; c <= 4; c++) {
      grid[r][c] = { x: c, y: r, type: CELL_TYPES.SHELF, label: `C-${r - 9}${c - 1}` };
    }
    for (let c = 6; c <= 8; c++) {
      grid[r][c] = { x: c, y: r, type: CELL_TYPES.SHELF, label: `D-${r - 9}${c - 5}` };
    }
  }

  // Shelf E & F
  for (let r = 3; r <= 13; r += 5) {
    for (let c = 11; c <= 17; c += 2) {
      grid[r][c] = { x: c, y: r, type: CELL_TYPES.SHELF, label: `E-${r}-${c}` };
      grid[r + 1][c] = { x: c, y: r + 1, type: CELL_TYPES.SHELF, label: `F-${r}-${c}` };
    }
  }

  // Charging Stations (Top Left & Top Right)
  grid[0][0] = { x: 0, y: 0, type: CELL_TYPES.CHARGING, label: 'CHG-1' };
  grid[0][1] = { x: 1, y: 0, type: CELL_TYPES.CHARGING, label: 'CHG-2' };
  grid[0][18] = { x: 18, y: 0, type: CELL_TYPES.CHARGING, label: 'CHG-3' };
  grid[0][19] = { x: 19, y: 0, type: CELL_TYPES.CHARGING, label: 'CHG-4' };

  // Packing Area (Bottom Left)
  grid[18][1] = { x: 1, y: 18, type: CELL_TYPES.PACKING, label: 'PACK-1' };
  grid[18][2] = { x: 2, y: 18, type: CELL_TYPES.PACKING, label: 'PACK-2' };
  grid[19][1] = { x: 1, y: 19, type: CELL_TYPES.PACKING, label: 'PACK-3' };
  grid[19][2] = { x: 2, y: 19, type: CELL_TYPES.PACKING, label: 'PACK-4' };

  // Delivery Zone (Bottom Right)
  grid[18][17] = { x: 17, y: 18, type: CELL_TYPES.DELIVERY, label: 'DEL-1' };
  grid[18][18] = { x: 18, y: 18, type: CELL_TYPES.DELIVERY, label: 'DEL-2' };
  grid[19][17] = { x: 17, y: 19, type: CELL_TYPES.DELIVERY, label: 'DEL-3' };
  grid[19][18] = { x: 18, y: 19, type: CELL_TYPES.DELIVERY, label: 'DEL-4' };

  // Fixed Obstacles / Pillars
  const obstacles = [
    { x: 5, y: 5 }, { x: 5, y: 11 },
    { x: 9, y: 2 }, { x: 9, y: 8 }, { x: 9, y: 14 },
    { x: 14, y: 7 }, { x: 14, y: 15 }
  ];
  obstacles.forEach(o => {
    grid[o.y][o.x] = { x: o.x, y: o.y, type: CELL_TYPES.OBSTACLE, label: 'PILLAR' };
  });

  return grid;
};

// 20 Simulated Robots (AGV Fleet)
export const INITIAL_ROBOTS = [
  { id: 'R-01', name: 'Kiva AMR Alpha', status: 'Moving', priority: 'Emergency', battery: 94, speed: 1.5, pos: { x: 0, y: 5 }, target: { x: 2, y: 3 }, currentTask: 'Order #101 Pickup', eta: '45s', remainingDistance: '8 m', payload: '12 kg', model: 'AGV-100X', lastUpdated: '1s ago' },
  { id: 'R-02', name: 'Kiva AMR Beta', status: 'Moving', priority: 'Loaded', battery: 88, speed: 1.4, pos: { x: 1, y: 0 }, target: { x: 17, y: 18 }, currentTask: 'Order #102 Transit', eta: '1m 12s', remainingDistance: '68 m', payload: '8 kg', model: 'AGV-100X', lastUpdated: '2s ago' },
  { id: 'R-03', name: 'Titan Forklift 01', status: 'Moving', priority: 'Loaded', battery: 76, speed: 1.2, pos: { x: 6, y: 1 }, target: { x: 6, y: 4 }, currentTask: 'Order #120 Shelf Transfer', eta: '20s', remainingDistance: '6 m', payload: '45 kg', model: 'FL-500', lastUpdated: 'Just now' },
  { id: 'R-04', name: 'Omni Rover X', status: 'Charging', priority: 'Idle', battery: 18, speed: 0, pos: { x: 0, y: 0 }, target: { x: 0, y: 0 }, currentTask: 'Docked - Supercharging', eta: '14m', remainingDistance: '0 m', payload: '0 kg', model: 'OR-50', lastUpdated: '5s ago' },
  { id: 'R-05', name: 'Kiva AMR Gamma', status: 'Moving', priority: 'Normal', battery: 82, speed: 1.6, pos: { x: 10, y: 0 }, target: { x: 1, y: 18 }, currentTask: 'Order #104 Delivery', eta: '50s', remainingDistance: '54 m', payload: '15 kg', model: 'AGV-100X', lastUpdated: '1s ago' },
  { id: 'R-06', name: 'Omni Rover Y', status: 'Charging', priority: 'Idle', battery: 24, speed: 0, pos: { x: 18, y: 0 }, target: { x: 18, y: 0 }, currentTask: 'Docked - Standard Charge', eta: '22m', remainingDistance: '0 m', payload: '0 kg', model: 'OR-50', lastUpdated: '3s ago' },
  { id: 'R-07', name: 'Kiva AMR Delta', status: 'Idle', priority: 'Idle', battery: 98, speed: 0, pos: { x: 5, y: 0 }, target: null, currentTask: 'Standby - Station 2', eta: 'N/A', remainingDistance: '0 m', payload: '0 kg', model: 'AGV-100X', lastUpdated: '4s ago' },
  { id: 'R-08', name: 'Titan Forklift 02', status: 'Moving', priority: 'Loaded', battery: 65, speed: 1.1, pos: { x: 15, y: 2 }, target: { x: 18, y: 18 }, currentTask: 'Heavy Pallet Transfer', eta: '1m 40s', remainingDistance: '38 m', payload: '80 kg', model: 'FL-500', lastUpdated: '1s ago' },
  { id: 'R-09', name: 'Swift Runner 1', status: 'Moving', priority: 'Normal', battery: 91, speed: 2.0, pos: { x: 12, y: 9 }, target: { x: 2, y: 19 }, currentTask: 'Express Picking #109', eta: '30s', remainingDistance: '40 m', payload: '4 kg', model: 'SR-20', lastUpdated: 'Just now' },
  { id: 'R-10', name: 'Swift Runner 2', status: 'Moving', priority: 'Normal', battery: 85, speed: 1.9, pos: { x: 8, y: 15 }, target: { x: 6, y: 12 }, currentTask: 'Order #110 Pickup', eta: '35s', remainingDistance: '10 m', payload: '5 kg', model: 'SR-20', lastUpdated: '2s ago' },
  { id: 'R-11', name: 'Kiva AMR Epsilon', status: 'Idle', priority: 'Idle', battery: 95, speed: 0, pos: { x: 15, y: 0 }, target: null, currentTask: 'Awaiting Task Assignment', eta: 'N/A', remainingDistance: '0 m', payload: '0 kg', model: 'AGV-100X', lastUpdated: '10s ago' },
  { id: 'R-12', name: 'Titan Forklift 03', status: 'Moving', priority: 'Loaded', battery: 52, speed: 1.2, pos: { x: 4, y: 10 }, target: { x: 1, y: 18 }, currentTask: 'Stacking Operations', eta: '1m 10s', remainingDistance: '22 m', payload: '60 kg', model: 'FL-500', lastUpdated: '1s ago' },
  { id: 'R-13', name: 'Omni Rover Z', status: 'Charging', priority: 'Idle', battery: 12, speed: 0, pos: { x: 19, y: 0 }, target: { x: 19, y: 0 }, currentTask: 'Docked - Low Voltage Warning', eta: '35m', remainingDistance: '0 m', payload: '0 kg', model: 'OR-50', lastUpdated: '6s ago' },
  { id: 'R-14', name: 'Swift Runner 3', status: 'Moving', priority: 'Normal', battery: 73, speed: 1.8, pos: { x: 16, y: 10 }, target: { x: 17, y: 19 }, currentTask: 'Order #114 Express Drop', eta: '25s', remainingDistance: '20 m', payload: '3 kg', model: 'SR-20', lastUpdated: 'Just now' },
  { id: 'R-15', name: 'Kiva AMR Zeta', status: 'Moving', priority: 'Normal', battery: 89, speed: 1.5, pos: { x: 7, y: 7 }, target: { x: 11, y: 3 }, currentTask: 'Inventory Audit Scan', eta: '55s', remainingDistance: '16 m', payload: '2 kg', model: 'AGV-100X', lastUpdated: '3s ago' },
  { id: 'R-16', name: 'Kiva AMR Eta', status: 'Idle', priority: 'Idle', battery: 99, speed: 0, pos: { x: 10, y: 19 }, target: null, currentTask: 'Standby Bay South', eta: 'N/A', remainingDistance: '0 m', payload: '0 kg', model: 'AGV-100X', lastUpdated: '8s ago' },
  { id: 'R-17', name: 'Omni Rover W', status: 'Moving', priority: 'Loaded', battery: 67, speed: 1.5, pos: { x: 3, y: 16 }, target: { x: 18, y: 19 }, currentTask: 'Order #117 Dispatch', eta: '1m 05s', remainingDistance: '36 m', payload: '10 kg', model: 'OR-50', lastUpdated: '2s ago' },
  { id: 'R-18', name: 'Titan Forklift 04', status: 'Emergency', priority: 'Emergency', battery: 41, speed: 0, pos: { x: 11, y: 8 }, target: null, currentTask: 'E-Stop Triggered (Obstacle)', eta: 'N/A', remainingDistance: '0 m', payload: '50 kg', model: 'FL-500', lastUpdated: '12s ago' },
  { id: 'R-19', name: 'Swift Runner 4', status: 'Moving', priority: 'Emergency', battery: 81, speed: 2.0, pos: { x: 14, y: 18 }, target: { x: 4, y: 3 }, currentTask: 'High Priority Pick', eta: '40s', remainingDistance: '50 m', payload: '6 kg', model: 'SR-20', lastUpdated: 'Just now' },
  { id: 'R-20', name: 'Kiva AMR Theta', status: 'Moving', priority: 'Loaded', battery: 78, speed: 1.5, pos: { x: 18, y: 12 }, target: { x: 2, y: 18 }, currentTask: 'Order #120 Sorting', eta: '1m 15s', remainingDistance: '44 m', payload: '14 kg', model: 'AGV-100X', lastUpdated: '2s ago' }
];

// Generate 100 Sample Orders
export const generateSampleOrders = () => {
  const priorities = ['High', 'Medium', 'Low'];
  const statuses = ['Pending', 'Picking', 'In-Transit', 'Delivered'];
  const locations = [
    { name: 'Shelf A-1', x: 2, y: 3 },
    { name: 'Shelf B-3', x: 7, y: 5 },
    { name: 'Shelf C-2', x: 3, y: 11 },
    { name: 'Shelf D-4', x: 8, y: 12 },
    { name: 'Shelf E-1', x: 11, y: 3 },
    { name: 'Packing Station 1', x: 1, y: 18 },
    { name: 'Packing Station 2', x: 2, y: 19 },
    { name: 'Delivery Bay 1', x: 17, y: 18 },
    { name: 'Delivery Bay 2', x: 18, y: 19 }
  ];

  const orders = [];
  for (let i = 1; i <= 100; i++) {
    const pIdx = i % 3 === 0 ? 0 : i % 2 === 0 ? 1 : 2;
    const sIdx = i <= 25 ? 2 : i <= 60 ? 3 : i <= 85 ? 1 : 0;
    const pickupLoc = locations[i % locations.length];
    const dropLoc = locations[(i + 3) % locations.length];
    const robotId = `R-${String((i % 20) + 1).padStart(2, '0')}`;
    const distance = Math.floor(Math.abs(pickupLoc.x - dropLoc.x) + Math.abs(pickupLoc.y - dropLoc.y)) * 4 + 10;

    orders.push({
      id: `ORD-#${100 + i}`,
      pickup: `${pickupLoc.name} (${pickupLoc.x},${pickupLoc.y})`,
      pickupCoords: { x: pickupLoc.x, y: pickupLoc.y },
      drop: `${dropLoc.name} (${dropLoc.x},${dropLoc.y})`,
      dropCoords: { x: dropLoc.x, y: dropLoc.y },
      priority: priorities[pIdx],
      assignedRobot: robotId,
      distance: `${distance} m`,
      estTime: `${Math.round(distance / 1.5)} s`,
      status: statuses[sIdx],
      createdAt: `2026-08-05 0${(i % 8) + 1}:${String((i * 7) % 60).padStart(2, '0')}`
    });
  }
  return orders;
};

// Sample Live Activity Logs Stream
export const INITIAL_ACTIVITIES = [
  { id: 1, time: '08:10:45', robot: 'Robot-03', text: 'Assigned to Order #120 (Shelf Transfer)', type: 'task' },
  { id: 2, time: '08:10:32', robot: 'Robot-06', text: 'Docked at CHG-3 - Charging started (24%)', type: 'charging' },
  { id: 3, time: '08:10:15', robot: 'Robot-18', text: 'Collision avoided with Robot-08 at cell (11,8) - Auto Replanned', type: 'collision' },
  { id: 4, time: '08:09:50', robot: 'Robot-09', text: 'Completed Order #109 delivery at Delivery Bay 2', type: 'order' },
  { id: 5, time: '08:09:22', robot: 'System', text: 'New high priority Order #125 generated by Dispatch API', type: 'task' },
  { id: 6, time: '08:08:58', robot: 'Robot-01', text: 'Path replanned using A* algorithm (Nodes visited: 42, 1.2ms)', type: 'replan' },
  { id: 7, time: '08:08:30', robot: 'Robot-04', text: 'Battery level reached 18% - Auto rerouted to CHG-1', type: 'charging' },
  { id: 8, time: '08:07:44', robot: 'Robot-14', text: 'Express item picked up from Shelf E-1', type: 'task' },
];

// Project Metadata (Academic Capstone Information)
export const PROJECT_INFO = {
  title: 'Intelligent Multi-Robot Warehouse Path Planner',
  subtitle: 'Final Year B.Tech Computer Engineering Capstone Project',
  academicYear: '2025 - 2026',
  department: 'Department of Computer Engineering',
  university: 'College of Engineering & Technology',
  team: [
    { name: 'Harshal S.', rollNo: 'CE-2022-042', role: 'Algorithm & Frontend Specialist' },
    { name: 'Collaborator Team', rollNo: 'CE-2022-043', role: 'Simulation Engine Lead' }
  ],
  projectGuide: 'Dr. A. Sharma (Prof., Dept of Computer Science)',
  projectId: 'CE-2026-PRJ-42',
  version: 'v2.4.0-release'
};
