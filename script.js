// Import GSAP and Three.js
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { gsap } from 'https://cdn.skypack.dev/gsap@3.11.4';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.11.4/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize 3D Globe
let globe;

function initGlobe() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(300, 300);
    document.querySelector('.globe-container').appendChild(renderer.domElement);

    // Create globe geometry
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/land_ocean_ice_cloud_2048.jpg'),
        bumpMap: new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/earth_bumpmap.jpg'),
        bumpScale: 0.05,
        specularMap: new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/earth_specular_2048.jpg'),
        specular: new THREE.Color('grey')
    });

    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.001;
        renderer.render(scene, camera);
    }

    animate();
}

// Initialize Scroll Animations
function initScrollAnimations() {
    // Fade in cards on scroll
    gsap.utils.toArray('.card').forEach(card => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Slide in charts
    gsap.utils.toArray('.chart-container').forEach((chart, i) => {
        gsap.from(chart, {
            opacity: 0,
            x: i % 2 === 0 ? -100 : 100,
            duration: 1,
            scrollTrigger: {
                trigger: chart,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// Card Hover Effects
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = -(x - centerX) / 20;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// Button Hover Effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('.control-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Initialize Charts with Animation
function initCharts() {
    // Soil Trends Chart
    const soilTrendsCtx = document.getElementById('soilTrendsChart').getContext('2d');
    new Chart(soilTrendsCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Moisture (%)',
                data: [65, 62, 68, 65, 61, 64, 66],
                borderColor: '#2ecc71',
                tension: 0.4,
                fill: false
            }, {
                label: 'Temperature (°C)',
                data: [24, 25, 23, 24, 26, 25, 24],
                borderColor: '#e74c3c',
                tension: 0.4,
                fill: false
            }, {
                label: 'pH Level',
                data: [6.8, 6.7, 6.9, 6.8, 6.7, 6.8, 6.9],
                borderColor: '#3498db',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });

    // Water Usage Chart
    const waterUsageCtx = document.getElementById('waterUsageChart').getContext('2d');
    new Chart(waterUsageCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Water Usage (Liters)',
                data: [120, 150, 140, 130, 145, 135, 125],
                backgroundColor: '#3498db',
                borderRadius: 5
            }]
        },
        options: {
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    initGlobe();
    initScrollAnimations();
    initCardHoverEffects();
    initButtonEffects();
    initCharts();
});

// Chart Period Controls
document.querySelectorAll('.chart-controls button').forEach(button => {
    button.addEventListener('click', () => {
        const period = button.dataset.period;
        const parent = button.closest('.chart-container');
        
        // Remove active class from all buttons in this container
        parent.querySelectorAll('.chart-controls button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update chart data based on period (mock data update)
        // In a real application, this would fetch new data from the server
        const chart = Chart.getChart(parent.querySelector('canvas'));
        if (chart) {
            const newData = generateMockData(period);
            chart.data.datasets.forEach((dataset, index) => {
                dataset.data = newData[index];
            });
            chart.update();
        }
    });
});

// Generate mock data for different time periods
function generateMockData(period) {
    const dataPoints = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    return [
        Array.from({ length: dataPoints }, () => Math.floor(Math.random() * 20) + 50),
        Array.from({ length: dataPoints }, () => Math.floor(Math.random() * 10) + 20),
        Array.from({ length: dataPoints }, () => (Math.random() * 1) + 6)
    ];
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 50
                },
                ease: 'power2.inOut'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    const nav = document.getElementById('nav');

    mobileMenu.addEventListener('click', function () {
        nav.classList.toggle('active');
        if (nav.classList.contains('active')) {
            mobileMenu.innerHTML = `
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            `;
        } else {
            mobileMenu.innerHTML = `
                <span class="bar" style="transform: rotate(45deg) translate(6px, 6px);"></span>
                <span class="bar" style="display: none;"></span>
                <span class="bar" style="transform: rotate(-45deg) translate(6px, -6px);"></span>
            `;
        }
    });

    function toggleAuthBox(type) {
        const loginBox = document.getElementById('loginBox');
        const signupBox = document.getElementById('signupBox');

        if (type === 'login') {
            loginBox.style.display = 'block';
            signupBox.style.display = 'none';
        } else if (type === 'signup') {
            loginBox.style.display = 'none';
            signupBox.style.display = 'block';
        }
    }

    // Google Sign-In
    function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }

    // Form submission handling
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log('Login:', email, password);
    });

    document.getElementById('signupForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log('Signup:', name, email, password);
    });

    // Soil Trends Chart
    const soilTrendsCtx = document.getElementById('soilTrendsChart').getContext('2d');
    new Chart(soilTrendsCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Soil Moisture (%)',
                data: [45, 42, 47, 45, 43, 40, 45],
                borderColor: '#2ecc71',
                tension: 0.4,
                fill: false
            }, {
                label: 'Soil Temperature (°C)',
                data: [24, 25, 23, 24, 26, 25, 24],
                borderColor: '#e74c3c',
                tension: 0.4,
                fill: false
            }, {
                label: 'pH Level',
                data: [6.5, 6.4, 6.6, 6.5, 6.7, 6.5, 6.5],
                borderColor: '#3498db',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    // Water Usage Chart
    const waterUsageCtx = document.getElementById('waterUsageChart').getContext('2d');
    new Chart(waterUsageCtx, {
        type: 'bar',
        data: {
            labels: ['6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'],
            datasets: [{
                label: 'Water Usage (Liters)',
                data: [250, 180, 300, 280, 220, 150],
                backgroundColor: '#3498db',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value + 'L';
                        }
                    }
                }
            }
        }
    });

    // Crop Growth Analysis Chart
    const cropGrowthCtx = document.getElementById('cropGrowthChart').getContext('2d');
    new Chart(cropGrowthCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Wheat Growth',
                data: [65, 72, 78, 85, 89, 93],
                borderColor: '#4834d4',
                tension: 0.4,
                fill: false
            }, {
                label: 'Corn Growth',
                data: [45, 55, 65, 75, 82, 88],
                borderColor: '#00b894',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function (value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });

    // Equipment Usage Chart
    const equipmentCtx = document.getElementById('equipmentChart').getContext('2d');
    new Chart(equipmentCtx, {
        type: 'bar',
        data: {
            labels: ['Tractors', 'Harvesters', 'Sprayers', 'Plows', 'Seeders'],
            datasets: [{
                label: 'Hours Used',
                data: [125, 85, 65, 45, 92],
                backgroundColor: [
                    '#4834d4',
                    '#00b894',
                    '#ffeaa7',
                    '#ff7675',
                    '#a8e6cf'
                ],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value + ' hrs';
                        }
                    }
                }
            }
        }
    });

    // Chart period controls
    document.querySelectorAll('.chart-controls button').forEach(button => {
        button.addEventListener('click', function () {
            const parent = this.parentElement;
            parent.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Add logic to update chart data based on selected period
        });
    });

    // Irrigation Controls
    document.querySelectorAll('.control-btn').forEach(button => {
        button.addEventListener('click', function () {
            const action = this.textContent.toLowerCase();

            switch (action) {
                case 'start irrigation':
                    // Add logic to start irrigation
                    alert('Starting irrigation system...');
                    break;
                case 'stop irrigation':
                    // Add logic to stop irrigation
                    alert('Stopping irrigation system...');
                    break;
                case 'set schedule':
                    // Add logic to open schedule modal
                    alert('Opening irrigation schedule settings...');
                    break;
                case 'view full schedule':
                    // Add logic to view fertilizer schedule
                    alert('Opening full fertilizer schedule...');
                    break;
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        // Add search functionality here
    });

    // Notification system
    const notificationBell = document.querySelector('.notifications i');
    notificationBell.addEventListener('click', function () {
        // Add notification functionality here
        alert('Latest Notifications:\n- Low soil moisture in Field #3\n- Weather alert: Rain expected tomorrow\n- Fertilizer application due in 2 days');
    });

    // Add active class to sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            // Add active class to clicked link
            this.parentElement.classList.add('active');
        });
    });

    // Alert action button
    const alertActionBtn = document.querySelector('.alert-action');
    if (alertActionBtn) {
        alertActionBtn.addEventListener('click', function () {
            alert('Initiating emergency irrigation for Field #3...');
        });
    }
});