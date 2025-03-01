/**
 * NΛN Quantum Technologies
 * Main JavaScript File
 * © 2025 NΛN Quantum Technologies
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initTabs();
  initQuantumHeroVisualization();
  initStateTypeVisualizations();
  initFinanceVisualizations();
  initAnimations();
  initFormValidation();

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});

/**
 * Mobile Navigation
 */
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainMenu = document.getElementById('main-menu');

  if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      mainMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (mainMenu.classList.contains('active') &&
          !event.target.closest('.main-nav') &&
          !event.target.closest('.menu-toggle')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && mainMenu.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }
}

/**
 * Tab Interface
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });

      // Add active class to clicked button
      this.classList.add('active');

      // Show corresponding content
      const tabId = this.getAttribute('data-tab');
      const tabContent = document.getElementById(`${tabId}-content`);
      if (tabContent) {
        tabContent.classList.add('active');

        // Initialize visualizations for this tab if needed
        if (tabId === 'finance' && !tabContent.getAttribute('data-initialized')) {
          initFinanceViz();
          tabContent.setAttribute('data-initialized', 'true');
        } else if (tabId === 'pharma' && !tabContent.getAttribute('data-initialized')) {
          initPharmaViz();
          tabContent.setAttribute('data-initialized', 'true');
        } else if (tabId === 'energy' && !tabContent.getAttribute('data-initialized')) {
          initEnergyViz();
          tabContent.setAttribute('data-initialized', 'true');
        }
      }
    });
  });
}

/**
 * Quantum Hero Visualization
 * Creates an interactive quantum state visualization in the hero section
 */
function initQuantumHeroVisualization() {
  const heroVizContainer = document.getElementById('quantum-hero-viz');
  if (!heroVizContainer) return;

  // Create a canvas element for visualization
  const canvas = document.createElement('canvas');
  canvas.width = heroVizContainer.offsetWidth;
  canvas.height = heroVizContainer.offsetHeight;
  heroVizContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Set up the quantum state visualization
  const particles = [];
  const particleCount = 100;

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      color: getQuantumParticleColor(Math.random()),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      phase: Math.random() * Math.PI * 2,
      coherence: 0.75 + Math.random() * 0.2 // Random coherence between 0.75 and 0.95
    });
  }

  // Animation function
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw quantum state background grid
    drawQuantumGrid(ctx, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
      // Update particle position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.phase += 0.02;

      // Boundary check
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // Calculate particle opacity based on coherence and phase
      const opacity = 0.3 + (particle.coherence * 0.7 * (Math.sin(particle.phase) + 1) / 2);

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${opacity})`;
      ctx.fill();

      // Draw connections between particles that are close to each other
      particles.forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${0.05 * (1 - distance / 100)})`;
          ctx.stroke();
        }
      });
    });

    // Add verification effect
    drawVerificationEffect(ctx, canvas.width, canvas.height);

    requestAnimationFrame(animate);
  }

  // Start animation
  animate();

  // Handle window resize
  window.addEventListener('resize', function() {
    canvas.width = heroVizContainer.offsetWidth;
    canvas.height = heroVizContainer.offsetHeight;
  });
}

/**
 * Draw quantum grid background
 */
function drawQuantumGrid(ctx, width, height) {
  const gridSize = 30;
  ctx.strokeStyle = 'rgba(11, 59, 143, 0.1)';
  ctx.lineWidth = 1;

  // Draw vertical lines
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

/**
 * Draw verification effect overlay
 */
function drawVerificationEffect(ctx, width, height) {
  // Draw scanning line effect
  const time = Date.now() * 0.001;
  const scanLineY = (Math.sin(time) + 1) / 2 * height;

  ctx.beginPath();
  ctx.moveTo(0, scanLineY);
  ctx.lineTo(width, scanLineY);
  ctx.strokeStyle = 'rgba(0, 169, 172, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw glow effect around scan line
  const gradient = ctx.createLinearGradient(0, scanLineY - 20, 0, scanLineY + 20);
  gradient.addColorStop(0, 'rgba(0, 169, 172, 0)');
  gradient.addColorStop(0.5, 'rgba(0, 169, 172, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 169, 172, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, scanLineY - 20, width, 40);

  // Draw verification metrics
  ctx.font = '12px monospace';
  ctx.fillStyle = 'rgba(0, 169, 172, 0.8)';
  ctx.fillText(`Coherence: 0.92`, 20, 30);
  ctx.fillText(`Normalization: 1.00000`, 20, 50);
  ctx.fillText(`Math Integrity: Verified`, 20, 70);
}

/**
 * Generate a quantum particle color
 */
function getQuantumParticleColor(value) {
  // Map value to a color based on NΛN color scheme
  // Transition from quantum blue to integrity teal
  const blue = { r: 11, g: 59, b: 143 }; // Quantum Blue
  const teal = { r: 0, g: 169, b: 172 }; // Integrity Teal

  return {
    r: Math.round(blue.r + (teal.r - blue.r) * value),
    g: Math.round(blue.g + (teal.g - blue.g) * value),
    b: Math.round(blue.b + (teal.b - blue.b) * value)
  };
}

/**
 * State-Type Visualization
 * Shows how different quantum states are detected and verified
 */
function initStateTypeVisualizations() {
  // Example implementation - would be expanded in actual implementation
  const stateTypeIcon = document.querySelector('.state-type-icon');

  if (stateTypeIcon) {
    // Create a simple visualization for state type detection
    const canvas = document.createElement('canvas');
    canvas.width = 60;
    canvas.height = 60;
    stateTypeIcon.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Draw state type visualization
    function drawStateType() {
      const time = Date.now() * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw three different state types in sequence
      const stateType = Math.floor(time % 3);

      ctx.beginPath();
      ctx.arc(30, 30, 20, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(11, 59, 143, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (stateType === 0) {
        // Peaked state
        ctx.beginPath();
        ctx.arc(30, 30, 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(11, 59, 143, 0.5)';
        ctx.fill();

        const text = "Peaked";
        ctx.font = '8px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(text, 30, 33);
      } else if (stateType === 1) {
        // Uniform state
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = i * Math.PI / 4;
          const x = 30 + Math.cos(angle) * 15;
          const y = 30 + Math.sin(angle) * 15;
          ctx.rect(x - 2, y - 2, 4, 4);
        }
        ctx.fillStyle = 'rgba(11, 59, 143, 0.5)';
        ctx.fill();

        const text = "Uniform";
        ctx.font = '8px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(text, 30, 33);
      } else {
        // Standard state
        for (let i = 0; i < 4; i++) {
          const angle = i * Math.PI / 2;
          const x = 30 + Math.cos(angle) * 15;
          const y = 30 + Math.sin(angle) * 15;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(11, 59, 143, 0.5)';
          ctx.fill();
        }

        const text = "Standard";
        ctx.font = '8px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(text, 30, 33);
      }

      requestAnimationFrame(drawStateType);
    }

    drawStateType();
  }
}

/**
 * Financial Visualization for NΛN Finance
 */
function initFinanceVisualizations() {
  const financeViz = document.getElementById('finance-viz');
  if (!financeViz) return;

  // Create canvas for finance visualization
  const canvas = document.createElement('canvas');
  canvas.width = financeViz.offsetWidth;
  canvas.height = financeViz.offsetHeight;
  financeViz.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Generate simulated financial data
  const classicalData = generateSimulatedFinancialData(100, 0.05);
  const quantumData = generateSimulatedFinancialData(100, 0.02);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = 'rgba(229, 181, 77, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#4E5A6E';
    ctx.textAlign = 'center';
    ctx.fillText('Option Pricing Accuracy Comparison', canvas.width / 2, 30);

    // Draw legend
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#4E5A6E';
    ctx.textAlign = 'left';
    ctx.fillText('Classical Monte Carlo', 20, 60);
    ctx.fillText('NΛN Quantum', 20, 80);

    // Draw legend color boxes
    ctx.fillStyle = 'rgba(78, 90, 110, 0.7)';
    ctx.fillRect(150, 50, 15, 15);
    ctx.fillStyle = 'rgba(229, 181, 77, 0.7)';
    ctx.fillRect(150, 70, 15, 15);

    // Draw data points
    drawFinancialDataPoints(ctx, classicalData, quantumData, canvas.width, canvas.height);

    // Draw verification metrics
    ctx.font = '12px monospace';
    ctx.fillStyle = 'rgba(0, 169, 172, 0.8)';
    ctx.textAlign = 'right';
    ctx.fillText(`Mathematical Integrity: Verified`, canvas.width - 20, 30);
    ctx.fillText(`Coherence: 0.94`, canvas.width - 20, 50);
    ctx.fillText(`Normalization: 1.00000`, canvas.width - 20, 70);

    requestAnimationFrame(animate);
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', function() {
    canvas.width = financeViz.offsetWidth;
    canvas.height = financeViz.offsetHeight;
  });
}

/**
 * Draw financial data points for comparison visualization
 */
function drawFinancialDataPoints(ctx, classicalData, quantumData, width, height) {
  const padding = { top: 100, right: 50, bottom: 50, left: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Draw x and y axes
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.strokeStyle = '#4E5A6E';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw x-axis labels
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#4E5A6E';
  ctx.textAlign = 'center';
  for (let i = 0; i < 5; i++) {
    const x = padding.left + (graphWidth / 4) * i;
    ctx.fillText(`${i * 25}`, x, height - padding.bottom + 15);
  }

  // Draw y-axis labels
  ctx.textAlign = 'right';
  for (let i = 0; i < 5; i++) {
    const y = height - padding.bottom - (graphHeight / 4) * i;
    ctx.fillText(`${i * 25}%`, padding.left - 10, y + 5);
  }

  // Draw axis titles
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Time Step', width / 2, height - 10);

  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Accuracy', 0, 0);
  ctx.restore();

  // Draw classical data
  ctx.beginPath();
  ctx.moveTo(padding.left, height - padding.bottom);
  classicalData.forEach((value, index) => {
    const x = padding.left + (graphWidth / classicalData.length) * index;
    const y = height - padding.bottom - (graphHeight * value);
    ctx.lineTo(x, y);
  });
  ctx.strokeStyle = 'rgba(78, 90, 110, 0.7)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw quantum data
  ctx.beginPath();
  ctx.moveTo(padding.left, height - padding.bottom);
  quantumData.forEach((value, index) => {
    const x = padding.left + (graphWidth / quantumData.length) * index;
    const y = height - padding.bottom - (graphHeight * value);
    ctx.lineTo(x, y);
  });
  ctx.strokeStyle = 'rgba(229, 181, 77, 0.7)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Add gradient fill under quantum data line
  ctx.beginPath();
  ctx.moveTo(padding.left, height - padding.bottom);
  quantumData.forEach((value, index) => {
    const x = padding.left + (graphWidth / quantumData.length) * index;
    const y = height - padding.bottom - (graphHeight * value);
    ctx.lineTo(x, y);
  });
  ctx.lineTo(padding.left + graphWidth, height - padding.bottom);
  ctx.lineTo(padding.left, height - padding.bottom);

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(229, 181, 77, 0.3)');
  gradient.addColorStop(1, 'rgba(229, 181, 77, 0)');
  ctx.fillStyle = gradient;
  ctx.fill();

  // Highlight the advantage gap
  const midPoint = 50;
  const classicalValueAtMid = classicalData[midPoint];
  const quantumValueAtMid = quantumData[midPoint];

  if (quantumValueAtMid > classicalValueAtMid) {
    const x = padding.left + (graphWidth / quantumData.length) * midPoint;
    const y1 = height - padding.bottom - (graphHeight * classicalValueAtMid);
    const y2 = height - padding.bottom - (graphHeight * quantumValueAtMid);

    // Draw advantage line
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.strokeStyle = 'rgba(0, 169, 172, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw advantage label
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(0, 169, 172, 0.8)';
    ctx.textAlign = 'left';
    ctx.fillText('Quantum', x + 10, y2 + 5);
    ctx.fillText('Advantage', x + 10, y2 + 20);

    // Draw percentage
    const advantagePercentage = Math.round((quantumValueAtMid - classicalValueAtMid) * 100);
    ctx.fillText(`+${advantagePercentage}%`, x + 10, y2 + 35);
  }
}

/**
 * Generate simulated financial data for visualization
 */
function generateSimulatedFinancialData(length, volatility) {
  const data = Array(length).fill(0);

  // Start with some base value
  let value = 0.2;

  // First point
  data[0] = value;

  // Generate subsequent points with random walks
  for (let i = 1; i < length; i++) {
    // Add random noise
    const noise = (Math.random() - 0.5) * volatility;

    // Add upward trend for quantum data
    value += 0.005 + noise;

    // Ensure value stays between 0 and 1
    value = Math.max(0, Math.min(1, value));

    data[i] = value;
  }

  return data;
}

/**
 * Initialize Pharma visualization
 */
function initPharmaViz() {
  const pharmaViz = document.getElementById('pharma-viz');
  if (!pharmaViz) return;

  // Create canvas for pharmaceutical visualization
  const canvas = document.createElement('canvas');
  canvas.width = pharmaViz.offsetWidth;
  canvas.height = pharmaViz.offsetHeight;
  pharmaViz.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = 'rgba(125, 78, 141, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw molecule simulation placeholder
    drawMoleculeSimulation(ctx, canvas.width, canvas.height);

    requestAnimationFrame(animate);
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', function() {
    canvas.width = pharmaViz.offsetWidth;
    canvas.height = pharmaViz.offsetHeight;
  });
}

/**
 * Draw molecule simulation for pharma visualization
 */
function drawMoleculeSimulation(ctx, width, height) {
  const time = Date.now() * 0.001;

  // Draw title
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#4E5A6E';
  ctx.textAlign = 'center';
  ctx.fillText('Quantum Molecular Simulation', width / 2, 30);

  // Define molecule atoms
  const atoms = [
    { x: width / 2, y: height / 2, radius: 15, color: 'rgba(125, 78, 141, 0.8)', element: 'C' },
    { x: width / 2 + 60 * Math.cos(time), y: height / 2 + 60 * Math.sin(time), radius: 12, color: 'rgba(0, 169, 172, 0.8)', element: 'O' },
    { x: width / 2 + 60 * Math.cos(time + Math.PI * 2/3), y: height / 2 + 60 * Math.sin(time + Math.PI * 2/3), radius: 12, color: 'rgba(11, 59, 143, 0.8)', element: 'N' },
    { x: width / 2 + 60 * Math.cos(time + Math.PI * 4/3), y: height / 2 + 60 * Math.sin(time + Math.PI * 4/3), radius: 10, color: 'rgba(229, 181, 77, 0.8)', element: 'H' }
  ];

  // Draw bonds between atoms
  atoms.forEach((atom, i) => {
    for (let j = i + 1; j < atoms.length; j++) {
      const atom2 = atoms[j];

      ctx.beginPath();
      ctx.moveTo(atom.x, atom.y);
      ctx.lineTo(atom2.x, atom2.y);
      ctx.strokeStyle = 'rgba(78, 90, 110, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // Draw atoms
  atoms.forEach(atom => {
    // Draw atom
    ctx.beginPath();
    ctx.arc(atom.x, atom.y, atom.radius, 0, Math.PI * 2);
    ctx.fillStyle = atom.color;
    ctx.fill();

    // Draw element label
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(atom.element, atom.x, atom.y);
  });

  // Draw quantum wave around molecule
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(125, 78, 141, ${0.2 + 0.1 * Math.sin(time * 2)})`;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw verification metrics
  ctx.font = '12px monospace';
  ctx.fillStyle = 'rgba(0, 169, 172, 0.8)';
  ctx.textAlign = 'right';
  ctx.fillText(`Coherence: 0.91`, width - 20, 30);
  ctx.fillText(`Verification: State-Type-Aware`, width - 20, 50);
}

/**
 * Initialize Energy visualization
 */
function initEnergyViz() {
  const energyViz = document.getElementById('energy-viz');
  if (!energyViz) return;

  // Create canvas for energy visualization
  const canvas = document.createElement('canvas');
  canvas.width = energyViz.offsetWidth;
  canvas.height = energyViz.offsetHeight;
  energyViz.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = 'rgba(77, 175, 124, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw energy grid optimization visualization
    drawEnergyGridOptimization(ctx, canvas.width, canvas.height);

    requestAnimationFrame(animate);
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', function() {
    canvas.width = energyViz.offsetWidth;
    canvas.height = energyViz.offsetHeight;
  });
}

/**
 * Draw energy grid optimization visualization
 */
function drawEnergyGridOptimization(ctx, width, height) {
  const time = Date.now() * 0.001;

  // Draw title
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#4E5A6E';
  ctx.textAlign = 'center';
  ctx.fillText('Quantum Grid Optimization', width / 2, 30);

  // Draw energy grid
  const gridSize = 10;
  const nodeSize = 3;
  const gridWidth = Math.floor(width / gridSize);
  const gridHeight = Math.floor(height / gridSize);

  // Draw grid connections
  for (let x = 1; x < gridWidth - 1; x++) {
    for (let y = 1; y < gridHeight - 1; y++) {
      const centerX = x * gridSize;
      const centerY = y * gridSize;

      // Connect to adjacent nodes
      const directions = [
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: -1 }
      ];

      directions.forEach(dir => {
        const targetX = centerX + dir.dx * gridSize;
        const targetY = centerY + dir.dy * gridSize;

        // Determine if connection is active (optimized path)
        const distance = Math.sqrt(
          Math.pow(centerX - width/2, 2) +
          Math.pow(centerY - height/2, 2)
        );

                const isOptimized = distance < 100 + 50 * Math.sin(time + x * 0.1 + y * 0.1);

                // Draw connection line
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(targetX, targetY);

                if (isOptimized) {
                  // Optimized connection
                  ctx.strokeStyle = 'rgba(77, 175, 124, 0.8)';
                  ctx.lineWidth = 1.5;
                } else {
                  // Standard connection
                  ctx.strokeStyle = 'rgba(78, 90, 110, 0.2)';
                  ctx.lineWidth = 0.5;
                }

                ctx.stroke();
              });
            }
          }

          // Draw grid nodes
          for (let x = 1; x < gridWidth - 1; x++) {
            for (let y = 1; y < gridHeight - 1; y++) {
              const centerX = x * gridSize;
              const centerY = y * gridSize;

              // Calculate node energy level
              const distance = Math.sqrt(
                Math.pow(centerX - width/2, 2) +
                Math.pow(centerY - height/2, 2)
              );

              const energyLevel = 1 - Math.min(1, distance / 200);

              // Draw node with color based on energy level
              ctx.beginPath();
              ctx.arc(centerX, centerY, nodeSize, 0, Math.PI * 2);

              // Color ranges from blue (low energy) to green (high energy)
              const r = Math.round(77 * energyLevel);
              const g = Math.round(175 * energyLevel);
              const b = Math.round(124 * (1 - energyLevel) + 124 * energyLevel);

              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
              ctx.fill();
            }
          }

          // Draw optimization metrics
          ctx.font = '12px monospace';
          ctx.fillStyle = 'rgba(0, 169, 172, 0.8)';
          ctx.textAlign = 'right';
          ctx.fillText(`Grid Nodes: ${(gridWidth - 2) * (gridHeight - 2)}`, width - 20, 30);
          ctx.fillText(`Optimization: ${Math.round(90 + 5 * Math.sin(time))}%`, width - 20, 50);
          ctx.fillText(`Integrity: Verified`, width - 20, 70);

          // Draw quantum state overlay
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, 100 + 20 * Math.sin(time), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(77, 175, 124, ${0.2 + 0.1 * Math.sin(time)})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        /**
         * Initialize animations throughout the site
         */
        function initAnimations() {
          // Fade-in animations for sections as they enter viewport
          const fadeElements = document.querySelectorAll('.feature-item, .news-item, .solution-text, .hero-content');

          // Create observer for fade-in animations
          if ('IntersectionObserver' in window && fadeElements.length > 0) {
            const fadeObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('fade-in');
                  fadeObserver.unobserve(entry.target);
                }
              });
            }, { threshold: 0.2 });

            fadeElements.forEach(element => {
              element.classList.add('fade-element');
              fadeObserver.observe(element);
            });
          }

          // Number counter animations for stats
          const statElements = document.querySelectorAll('.case-study-results strong');

          if ('IntersectionObserver' in window && statElements.length > 0) {
            const statObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  animateNumber(entry.target);
                  statObserver.unobserve(entry.target);
                }
              });
            }, { threshold: 0.5 });

            statElements.forEach(element => {
              statObserver.observe(element);
            });
          }
        }

        /**
         * Animate a number from 0 to target value
         */
        function animateNumber(element) {
          const targetValue = parseFloat(element.textContent);
          let startValue = 0;
          const duration = 1500;
          const startTime = performance.now();

          function updateNumber(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            // Easing function for smooth animation
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            const currentValue = startValue + (targetValue - startValue) * easedProgress;
            element.textContent = Math.round(currentValue);

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              element.textContent = targetValue;
            }
          }

          requestAnimationFrame(updateNumber);
        }

        /**
         * Form validation for contact forms
         */
        function initFormValidation() {
          const forms = document.querySelectorAll('form');

          forms.forEach(form => {
            form.addEventListener('submit', function(e) {
              let isValid = true;

              // Clear previous error messages
              form.querySelectorAll('.error-message').forEach(error => {
                error.remove();
              });

              // Validate required fields
              form.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                  isValid = false;
                  showFieldError(field, 'This field is required');
                }
              });

              // Validate email fields
              form.querySelectorAll('input[type="email"]').forEach(emailField => {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailField.value.trim() && !emailPattern.test(emailField.value)) {
                  isValid = false;
                  showFieldError(emailField, 'Please enter a valid email address');
                }
              });

              // If form is invalid, prevent submission
              if (!isValid) {
                e.preventDefault();
              }
            });
          });
        }

        /**
         * Show error message for form field
         */
        function showFieldError(field, message) {
          const errorElement = document.createElement('div');
          errorElement.className = 'error-message';
          errorElement.textContent = message;
          errorElement.style.color = 'var(--alert-red)';
          errorElement.style.fontSize = '0.875rem';
          errorElement.style.marginTop = '0.25rem';

          field.parentNode.appendChild(errorElement);
          field.classList.add('error');
        }

        // Add styles for fade animations
        const style = document.createElement('style');
        style.textContent = `
          .fade-element {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease, transform 0.8s ease;
          }

          .fade-element.fade-in {
            opacity: 1;
            transform: translateY(0);
          }
        `;
        document.head.appendChild(style);
