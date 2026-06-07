const fs = require('fs');
const path = require('path');

const navCode = `
    <nav class="bg-surface/90 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/20 shadow-sm transition-all duration-300">
        <div class="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-4 flex justify-between items-center">
            <a href="2.html" class="flex items-center gap-2">
                <span class="font-headline-md text-headline-md font-extrabold text-primary">De Westplaat</span>
            </a>
            <div class="hidden lg:flex gap-6 items-center">
                <a href="2.html" class="text-on-surface hover:text-primary font-label-lg transition-colors">Home</a>
                <a href="3.html" class="text-on-surface hover:text-primary font-label-lg transition-colors">Over Ons</a>
                <a href="4.html" class="text-on-surface hover:text-primary font-label-lg transition-colors">Kaas</a>
                <a href="5.html" class="text-on-surface hover:text-primary font-label-lg transition-colors">Zuivel</a>
                <a href="6.html" class="text-on-surface hover:text-primary font-label-lg transition-colors">IJs</a>
                <a href="7.html" class="text-on-surface hover:text-primary font-label-lg transition-colors">Vlees</a>
                <a href="8.html" class="text-on-surface hover:text-primary font-label-lg transition-colors">Verkooppunten</a>
                <a href="9.html" class="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-lg hover:bg-primary-container transition-colors shadow-sm btn-hover-effect">Contact</a>
            </div>
            <button id="mobile-menu-btn" class="lg:hidden text-on-surface p-2 rounded-md hover:bg-surface-container transition-colors">
                <span class="material-symbols-outlined">menu</span>
            </button>
        </div>
        <div id="mobile-menu" class="hidden lg:hidden bg-surface border-t border-outline-variant/20 flex flex-col absolute w-full shadow-lg">
            <a href="2.html" class="px-margin-mobile py-4 text-on-surface hover:bg-surface-container font-label-lg border-b border-outline-variant/10">Home</a>
            <a href="3.html" class="px-margin-mobile py-4 text-on-surface hover:bg-surface-container font-label-lg border-b border-outline-variant/10">Over Ons</a>
            <a href="4.html" class="px-margin-mobile py-4 text-on-surface hover:bg-surface-container font-label-lg border-b border-outline-variant/10">Kaas</a>
            <a href="5.html" class="px-margin-mobile py-4 text-on-surface hover:bg-surface-container font-label-lg border-b border-outline-variant/10">Zuivel</a>
            <a href="6.html" class="px-margin-mobile py-4 text-on-surface hover:bg-surface-container font-label-lg border-b border-outline-variant/10">IJs</a>
            <a href="7.html" class="px-margin-mobile py-4 text-on-surface hover:bg-surface-container font-label-lg border-b border-outline-variant/10">Vlees</a>
            <a href="8.html" class="px-margin-mobile py-4 text-on-surface hover:bg-surface-container font-label-lg border-b border-outline-variant/10">Verkooppunten</a>
            <a href="9.html" class="px-margin-mobile py-4 text-primary bg-primary/5 hover:bg-primary/10 font-label-lg">Contact</a>
        </div>
    </nav>
`;

const styleCode = `
    <style>
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
`;

const jsCode = `
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const btn = document.getElementById('mobile-menu-btn');
            const menu = document.getElementById('mobile-menu');
            if (btn && menu) {
                btn.addEventListener('click', () => {
                    menu.classList.toggle('hidden');
                });
            }
            
            // Add reveal classes to sections if they don't have it
            document.querySelectorAll('section').forEach(sec => {
                if (!sec.classList.contains('reveal')) {
                    sec.classList.add('reveal');
                }
            });

            const reveals = document.querySelectorAll('.reveal');
            const revealOnScroll = () => {
                const windowHeight = window.innerHeight;
                const elementVisible = 100;
                reveals.forEach((reveal) => {
                    const elementTop = reveal.getBoundingClientRect().top;
                    if (elementTop < windowHeight - elementVisible) {
                        reveal.classList.add('active');
                    }
                });
            };
            window.addEventListener('scroll', revealOnScroll);
            revealOnScroll();
        });
    </script>
`;

for (let i = 2; i <= 9; i++) {
    let filePath = path.join(__dirname, i + '.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove existing nav to avoid duplication if run multiple times
        if (content.includes('<nav class="bg-surface/90')) {
            content = content.replace(/<nav class="bg-surface\/90[\s\S]*?<\/nav>/, '');
        }

        // Add CSS if not present
        if (!content.includes('.reveal.active')) {
            content = content.replace('</head>', styleCode + '</head>');
        }

        // Add JS if not present
        if (!content.includes('revealOnScroll()')) {
            content = content.replace('</body>', jsCode + '</body>');
        }

        // Add Nav right after body opening tag
        // Account for any body attributes
        content = content.replace(/(<body[^>]*>)/, '$1\\n' + navCode);
        
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + i + '.html');
    }
}
