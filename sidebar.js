// Sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarDarkToggle = document.getElementById('sidebarDarkToggle');
    const mainDarkToggle = document.getElementById('darkToggle');

    // Open sidebar
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    // Close sidebar
    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when clicking on nav links
    const sidebarNavLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    sidebarNavLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Sync dark mode toggles
    if (mainDarkToggle && sidebarDarkToggle) {
        // Sync main toggle to sidebar toggle
        mainDarkToggle.addEventListener('change', function() {
            sidebarDarkToggle.checked = this.checked;
        });

        // Sync sidebar toggle to main toggle
        sidebarDarkToggle.addEventListener('change', function() {
            mainDarkToggle.checked = this.checked;
        });
    }

    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });
});
