/**
 * Alas de Familia - Interacciones del Sitio Web
 * Funcionalidades interactivas, temas y animaciones
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initScrollEffects();
    initCycleSimulator();
    initContactForm();
});

/* ==========================================================================
   1. SISTEMA DE TEMAS (CLARO / OSCURO)
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Verificar preferencia guardada o sistema del dispositivo
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Aplicar el tema inicial
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    // Toggle al hacer clic
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

/* ==========================================================================
   2. MENÚ MÓVIL
   ========================================================================== */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
}

/* ==========================================================================
   3. EFECTOS DE SCROLL (REVEAL & SCROLLSPY)
   ========================================================================== */
function initScrollEffects() {
    const header = document.getElementById('header');
    
    // 3.1 Efecto sticky header al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });

    // 3.2 Animación de entrada al hacer scroll (Reveal)
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Dejar de observar una vez que ya apareció
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));

    // 3.3 Scrollspy - Resaltar enlace de navegación según la sección visible
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const scrollspyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');
                    if (href === id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.35
    });

    sections.forEach(sec => scrollspyObserver.observe(sec));
}

/* ==========================================================================
   4. SIMULADOR DEL CICLO AGROECOLÓGICO
   ========================================================================== */
function initCycleSimulator() {
    const nodes = document.querySelectorAll('.cycle-node');
    const displayPanel = document.getElementById('cycle-display-panel');
    const displayTitle = document.getElementById('cycle-display-title');
    const displayDesc = document.getElementById('cycle-display-desc');
    const displayIcon = document.getElementById('cycle-display-icon');

    if (!nodes.length || !displayPanel) return;

    // Contenido detallado para cada nodo del simulador
    const cycleData = {
        hidroponia: {
            title: "Forraje Verde Hidropónico Móvil",
            desc: "Diseñamos módulos móviles de cultivo hidropónico que producen forraje verde fresco, altamente nutritivo y constante los 365 días del año. Este sistema optimiza al máximo el agua y el suelo patagónico, sentando las bases del alimento premium para nuestra producción avícola.",
        },
        avicultura: {
            title: "Avicultura de Precisión con Bienestar",
            desc: "Nuestras aves se alimentan de forma mixta con granos seleccionados de alta calidad y el forraje hidropónico fresco generado en el proyecto. Esto garantiza huevos y carne de excelente calidad, con un perfil nutricional superior y libre de químicos o antibióticos.",
        },
        sustentabilidad: {
            title: "Economía Circular y Nutrición Orgánica",
            desc: "Nada se desperdicia. El guano avícola (gallinaza) es recuperado, compostado y procesado biológicamente para enriquecer el suelo patagónico o retroalimentar otros ciclos productivos, cerrando la brecha ecológica del modelo tradicional.",
        },
        comunidad: {
            title: "Impacto Comunitario y Social",
            desc: "Generamos empleo calificado y estable, impulsamos capacitaciones en nuevas tecnologías agrícolas y abrimos el capital de inversión para que los habitantes de Río Negro puedan sumarse y beneficiarse directamente del crecimiento regional sustentable.",
        }
    };

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            // Evitar re-animar si ya está activo
            if (node.classList.contains('active')) return;

            const nodeType = node.getAttribute('data-node');
            const data = cycleData[nodeType];
            
            if (!data) return;

            // Quitar clase activa de todos y añadir al seleccionado
            nodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            // Animación de desvanecimiento en el panel
            displayPanel.style.opacity = '0';
            displayPanel.style.transform = 'translateY(10px)';

            setTimeout(() => {
                // Actualizar textos
                displayTitle.textContent = data.title;
                displayDesc.textContent = data.desc;
                
                // Clonar el icono SVG del nodo para mostrarlo en el panel principal
                const sourceIconSvg = node.querySelector('.cycle-node-icon').innerHTML;
                displayIcon.innerHTML = sourceIconSvg;

                // Restaurar visibilidad
                displayPanel.style.opacity = '1';
                displayPanel.style.transform = 'translateY(0)';
            }, 300);
        });
    });
    
    // Configurar transición CSS en el panel de visualización
    displayPanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
}

/* ==========================================================================
   5. VALIDACIÓN Y ENVÍO DEL FORMULARIO DE CONTACTO
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('btn-submit-form');

    if (!form || !feedback || !submitBtn) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Limpiar feedback previo
        feedback.style.display = 'none';
        feedback.className = 'form-feedback';

        // Obtener valores
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const phone = document.getElementById('form-phone').value.trim();
        const message = document.getElementById('form-message').value.trim();

        // Validaciones básicas
        if (!name || !email || !phone || !message) {
            showFeedback("Por favor, completa todos los campos del formulario.", "error");
            return;
        }

        if (!validateEmail(email)) {
            showFeedback("Por favor, ingresa un correo electrónico válido.", "error");
            return;
        }

        // Estado de carga (Loading)
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Procesando...";

        // Simular envío de red
        setTimeout(() => {
            // Simular respuesta exitosa
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;

            showFeedback(`¡Gracias por contactarte, ${name}! Tu solicitud ha sido registrada con éxito. Nos comunicaremos al correo ${email} o al teléfono ${phone} a la brevedad para brindarte más detalles.`, "success");
            
            // Limpiar formulario
            form.reset();
        }, 1500);
    });

    function showFeedback(text, type) {
        feedback.textContent = text;
        feedback.style.display = 'block';
        feedback.classList.add(type);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}
