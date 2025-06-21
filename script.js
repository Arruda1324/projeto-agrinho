/**
 * Conexão Campo-Cidade - script.js
 * Implements interactive features, animations, and form validation.
 */

// ===== CONFIGURAÇÃO INICIAL =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas as funcionalidades
    setupBackToTop();
    setupAnimations();
    setupMobileMenu();
    setupFormValidation();
    setupCookieConsent();
    setupGallerySlider();
    setupTimelineAnimation();
    setupCommentSystem();
    setupOpenLayersMap();
});

// ===== BOTÃO VOLTAR AO TOPO =====
function setupBackToTop() {
    const backToTopBtn = document.querySelector('.voltar-ao-topo');
    if (!backToTopBtn) return;
    
    // Esconder o botão inicialmente
    backToTopBtn.style.display = 'none';
    
    // Mostrar/esconder botão baseado na posição de rolagem
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.transform = 'translateY(0)';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.transform = 'translateY(20px)';
            // Pequeno atraso para a transição acontecer antes de esconder
            setTimeout(() => {
                if (window.pageYOffset <= 300) {
                    backToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // Rolagem suave ao topo quando clicado com animação "aos poucos"
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Animação personalizada "aos poucos" - mais lenta e suave
        const startPosition = window.pageYOffset;
        const targetPosition = 0;
        const distance = startPosition - targetPosition;
        const duration = Math.max(1000, distance / 2); // Duração mínima de 1s, aumenta com a distância
        let start = null;
        
        function animateScroll(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Função de easing para movimento mais suave (ease-out)
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
            
            window.scrollTo(0, startPosition - (distance * easeOutQuart));
            
            if (progress < duration) {
                requestAnimationFrame(animateScroll);
            }
        }
        
        requestAnimationFrame(animateScroll);
    });
}

// ===== ANIMAÇÕES AO ROLAR =====
function setupAnimations() {
    const elementsToAnimate = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    // Configuração do Observer para animar elementos quando visíveis
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visivel');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // Observar todos os elementos que precisam ser animados
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // Adicionar animações aos links do menu para melhor UX
    const menuLinks = document.querySelectorAll('.menu-navegacao a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Se for um link interno com âncora
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Rolagem suave até a seção
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Atualizar URL sem recarregar
                    history.pushState(null, null, targetId);
                    
                    // Atualizar classe ativo
                    menuLinks.forEach(l => l.classList.remove('ativo'));
                    this.classList.add('ativo');
                }
            }
        });
    });
    
    // Destacar link ativo baseado na seção visível
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        menuLinks.forEach(link => {
            link.classList.remove('ativo');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('ativo');
            }
        });
    });
}

// ===== MENU MOBILE =====
function setupMobileMenu() {
    const menuToggle = document.querySelector('.responsivo-toggle');
    const menuNav = document.querySelector('.menu-navegacao');
    
    if (!menuToggle || !menuNav) return;
    
    menuToggle.addEventListener('click', () => {
        menuNav.classList.toggle('menu-aberto');
        
        // Animação do ícone do menu
        if (menuNav.classList.contains('menu-aberto')) {
            menuToggle.querySelector('i').classList.remove('fa-bars');
            menuToggle.querySelector('i').classList.add('fa-times');
        } else {
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        }
        
        // Prevenir rolagem do body quando menu estiver aberto
        document.body.classList.toggle('menu-ativo');
    });
    
    // Fechar menu ao clicar em um item
    const menuItems = menuNav.querySelectorAll('a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuNav.classList.remove('menu-aberto');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
            document.body.classList.remove('menu-ativo');
        });
    });
}

// ===== VALIDAÇÃO DE FORMULÁRIO =====
function setupFormValidation() {
    const form = document.querySelector('.formulario-contato');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const mensagem = document.getElementById('mensagem');
        
        // Validar campos
        if (!validateField(nome, nome.value.trim().length >= 3)) {
            isValid = false;
        }
        
        if (!validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))) {
            isValid = false;
        }
        
        if (!validateField(mensagem, mensagem.value.trim().length >= 10)) {
            isValid = false;
        }
        
        // Se tudo estiver válido, exibir confirmação e limpar o formulário
        if (isValid) {
            // Simulação de envio
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            setTimeout(() => {
                // Exibir mensagem de sucesso
                const formContainer = form.closest('.comentario-form-container');
                
                if (formContainer) {
                    formContainer.innerHTML = `
                        <div class="mensagem-sucesso">
                            <i class="fas fa-check-circle"></i>
                            <h3>Comentário enviado com sucesso!</h3>
                            <p>Seu comentário foi recebido e será exibido após moderação.</p>
                            <button type="button" class="btn btn-secundario" onclick="location.reload()">Enviar outro comentário</button>
                        </div>
                    `;
                } else {
                    alert('Comentário enviado com sucesso!');
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }, 1500);
        }
    });
    
    // Validação em tempo real
    const campos = form.querySelectorAll('input:not([type="checkbox"]), textarea');
    campos.forEach(campo => {
        campo.addEventListener('blur', function() {
            let isValid = true;
            
            switch (campo.id) {
                case 'nome':
                    isValid = campo.value.trim().length >= 3;
                    break;
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value);
                    break;
                case 'mensagem':
                    isValid = campo.value.trim().length >= 10;
                    break;
            }
            
            validateField(campo, isValid);
        });
    });
}

// Helper para validação de campos
function validateField(field, isValid) {
    const errorElement = field.parentElement.querySelector('.erro-feedback');
    
    if (!isValid) {
        field.classList.add('invalido');
        if (errorElement) {
            errorElement.style.display = 'block';
        }
        return false;
    } else {
        field.classList.remove('invalido');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        return true;
    }
}

// Helper para validação de campos
function validateField(field, isValid) {
    const errorElement = field.parentElement.querySelector('.erro-feedback');
    
    if (!isValid) {
        field.classList.add('invalido');
        if (errorElement) {
            errorElement.style.display = 'block';
        }
        return false;
    } else {
        field.classList.remove('invalido');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        return true;
    }
}

// ===== CONSENTIMENTO DE COOKIES =====
function setupCookieConsent() {
    const cookieBanner = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('cookie-accept');
    
    if (!cookieBanner || !acceptBtn) return;
    
    // Verificar se o usuário já aceitou os cookies
    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visivel');
        }, 1000);
    }
    
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.classList.remove('visivel');
        
        // Pequeno atraso antes de esconder completamente
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 500);
    });
}

// ===== GALERIA DE IMAGENS =====
function setupGallerySlider() {
    const sliders = document.querySelectorAll('.galeria-slider');
    
    sliders.forEach(slider => {
        if (!slider) return;
        
        const track = slider.querySelector('.slider-track');
        const slides = slider.querySelectorAll('.slide');
        const nextBtn = slider.querySelector('.next-btn');
        const prevBtn = slider.querySelector('.prev-btn');
        
        if (!track || !nextBtn || !prevBtn || slides.length === 0) return;
        
        let currentIndex = 0;
        
        // Botões de navegação
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSliderPosition();
        });
        
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSliderPosition();
        });
        
        // Atualizar posição do slider
        function updateSliderPosition() {
            const slideWidth = slides[0].offsetWidth;
            const offset = -currentIndex * slideWidth;
            track.style.transform = `translateX(${offset}px)`;
            
            // Atualizar indicadores se existirem
            const indicators = slider.querySelectorAll('.slide-indicator');
            indicators.forEach((indicator, i) => {
                if (i === currentIndex) {
                    indicator.classList.add('ativo');
                } else {
                    indicator.classList.remove('ativo');
                }
            });
        }
        
        // Adicionar suporte para gestos em dispositivos móveis
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            
            // Se o movimento foi significativo
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe para esquerda - próximo slide
                    currentIndex = (currentIndex + 1) % slides.length;
                } else {
                    // Swipe para direita - slide anterior
                    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                }
                
                updateSliderPosition();
            }
        }
        
        // Auto-play (opcional)
        let sliderInterval;
        function startAutoPlay() {
            sliderInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSliderPosition();
            }, 5000);
        }
        
        // Parar auto-play quando o usuário interagir
        function stopAutoPlay() {
            clearInterval(sliderInterval);
        }
        
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
        slider.addEventListener('touchstart', stopAutoPlay);
        
        // Iniciar auto-play
        startAutoPlay();
        
        // Criar indicadores dinamicamente
        createIndicators();
        function createIndicators() {
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'slide-indicators';
            
            for (let i = 0; i < slides.length; i++) {
                const indicator = document.createElement('span');
                indicator.className = 'slide-indicator';
                if (i === 0) indicator.classList.add('ativo');
                
                indicator.addEventListener('click', () => {
                    currentIndex = i;
                    updateSliderPosition();
                });
                
                indicatorsContainer.appendChild(indicator);
            }
            
            slider.appendChild(indicatorsContainer);
        }
    });
}

// ===== ANIMAÇÃO DA LINHA DO TEMPO =====
function setupTimelineAnimation() {
    const timeline = document.querySelector('.timeline');
    
    if (!timeline) return;
    
    const timelineItems = timeline.querySelectorAll('.timeline-item');
    
    // Animações baseadas na rolagem
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visivel');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    timelineItems.forEach(item => {
        // Adicionar classe para animação inicial
        if (item.classList.contains('left')) {
            item.classList.add('slide-in-right');
        } else {
            item.classList.add('slide-in-left');
        }
        
        observer.observe(item);
    });
}

// ===== SISTEMA DE COMENTÁRIOS =====
function setupCommentSystem() {
    const commentSection = document.querySelector('.comentarios-container');
    const paginationLinks = document.querySelectorAll('.pagina, .pagina-nav');
    
    if (!commentSection || !paginationLinks.length) return;
    
    // Simulação de paginação
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe atual de todos os links
            document.querySelectorAll('.pagina').forEach(p => {
                p.classList.remove('atual');
            });
            
            // Se for um número de página, adicionar classe atual
            if (this.classList.contains('pagina') && !this.classList.contains('pagina-nav')) {
                this.classList.add('atual');
            }
            
            // Simulação de carregamento de comentários
            const commentsContainer = commentSection.querySelector('.comentarios-lista');
            
            if (commentsContainer) {
                const loadingHTML = `<div class="loading">Carregando comentários...</div>`;
                commentsContainer.innerHTML = loadingHTML;
                
                // Simular delay de carregamento
                setTimeout(() => {
                    // Gerar comentários simulados para a página
                    const pageNumber = this.textContent;
                    const newComments = generateMockComments(pageNumber);
                    commentsContainer.innerHTML = newComments;
                }, 800);
            }
        });
    });
}

// Gerar comentários simulados para demonstração
function generateMockComments(page) {
    const users = [
        {name: 'Maria Silva', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', type: 'rural'},
        {name: 'João Santos', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', type: 'urbano'},
        {name: 'Ana Oliveira', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', type: 'rural'},
        {name: 'Carlos Andrade', avatar: 'https://randomuser.me/api/portraits/men/78.jpg', type: 'urbano'},
        {name: 'Luiza Costa', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', type: 'urbano'}
    ];
    
    const comments = [
        "Adoro as iniciativas de agricultura urbana! Tenho uma pequena horta em meu apartamento e isso me conecta com minhas raízes rurais.",
        "Como produtor rural, fico feliz em ver que os consumidores urbanos estão cada vez mais interessados na origem dos alimentos.",
        "Participei de uma feira de produtores locais no fim de semana e foi uma experiência incrível de conexão campo-cidade!",
        "A tecnologia pode aproximar produtores rurais e consumidores urbanos. Aplicativos de venda direta são o futuro da agricultura familiar.",
        "Precisamos de mais políticas públicas que incentivem a produção local e sustentável."
    ];
    
    let html = '';
    
    // Gerar 5 comentários por página
    for (let i = 0; i < 5; i++) {
        const userIndex = (parseInt(page) * i + i) % users.length;
        const commentIndex = (parseInt(page) * i + i) % comments.length;
        const user = users[userIndex];
        const date = new Date();
        date.setDate(date.getDate() - (i + parseInt(page)*3));
        
        html += `
        <div class="comentario-item ${i % 2 === 0 ? 'fade-in' : 'fade-in-delay'}">
            <div class="comentario-cabecalho">
                <div class="comentario-usuario">
                    <img src="${user.avatar}" alt="${user.name}" class="avatar">
                    <div>
                        <h4>${user.name}</h4>
                        <span class="badge badge-${user.type}">
                            ${user.type === 'rural' ? 'Produtor Rural' : 'Consumidor Urbano'}
                        </span>
                    </div>
                </div>
                <div class="comentario-data">
                    <i class="far fa-calendar-alt"></i>
                    ${date.toLocaleDateString('pt-BR')}
                </div>
            </div>
            <div class="comentario-conteudo">
                <p>${comments[commentIndex]}</p>
            </div>
            <div class="comentario-acoes">
                <button class="btn-acao">
                    <i class="far fa-thumbs-up"></i>
                    <span>${Math.floor(Math.random() * 50)}</span>
                </button>
                <button class="btn-acao">
                    <i class="far fa-comment"></i>
                    <span>Responder</span>
                </button>
                <button class="btn-acao">
                    <i class="fas fa-share-alt"></i>
                    <span>Compartilhar</span>
                </button>
            </div>
        </div>
        `;
    }
    
    return html;
}

// ===== OPENLAYERS MAP =====
function setupOpenLayersMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Coordenadas de Jandaia do Sul (Latitude, Longitude)
    const jandaiaCoords = [-51.6428, -23.6028]; // Longitude, Latitude

    // Converter coordenadas para a projeção do OpenLayers (Spherical Mercator)
    const jandaiaProjCoords = ol.proj.fromLonLat(jandaiaCoords);

    // Criar o mapa
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: jandaiaProjCoords,
            zoom: 13
        })
    });

    // Marcadores
    const markers = [
        { coords: [-51.6428, -23.6028], title: 'Centro Urbano de Jandaia do Sul' },
        { coords: [-51.6200, -23.5800], title: 'Área Rural Norte - Produção de café e agricultura familiar' },
        { coords: [-51.6600, -23.6300], title: 'Área Rural Sul - Diversificação agrícola' },
        { coords: [-51.6400, -23.6050], title: 'Estação Ferroviária - Conexão logística regional' }
    ];

    markers.forEach(markerInfo => {
        const marker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(markerInfo.coords))
        });

        const markerStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: 'https://openlayers.org/en/latest/examples/data/icon.png' // Ícone padrão do OpenLayers
            }),
            text: new ol.style.Text({
                text: markerInfo.title,
                font: '12px Calibri,sans-serif',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 3 }),
                offsetY: -30 // Ajustar posição do texto acima do marcador
            })
        });

        marker.setStyle(markerStyle);

        const vectorSource = new ol.source.Vector({
            features: [marker]
        });

        const vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });

        map.addLayer(vectorLayer);
    });

    // Adicionar um popup ao clicar no marcador (opcional, mas útil para exibir o título)
    const overlayContainer = document.createElement('div');
    overlayContainer.className = 'ol-popup';
    document.body.appendChild(overlayContainer);

    const overlay = new ol.Overlay({
        element: overlayContainer,
        autoPan: true,
        autoPanAnimation: { duration: 250 }
    });
    map.addOverlay(overlay);

    map.on('click', function(evt) {
        const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature;
        });
        if (feature) {
            const coordinates = feature.getGeometry().getCoordinates();
            overlay.setPosition(coordinates);
            overlayContainer.innerHTML = feature.get('title');
        } else {
            overlay.setPosition(undefined);
        }
    });
}


