document.addEventListener('DOMContentLoaded', function () {
    const loaderContainer = document.querySelector('.loader-cont');
    const content = document.querySelector('.containers');

    window.onload = async function () {
        try { return; } 
        catch (error) { console.error('⚠️ خطأ أثناء التحميل : ', error) } 
        finally {
            loaderContainer.classList.add('hidden');
            setTimeout(() => { content.classList.add('visible'); }, 500); }};

    document.querySelectorAll('.cards-cont').forEach((card) => {
        card.addEventListener('click', () => {
            const method = card.getAttribute('data-method');
            const previewContainer = document.querySelector('.previews');
            const previewBox = document.querySelector(`.preview[data-target="${method}"]`);

            if (previewBox) {
                previewContainer.style.display = 'flex';
                previewBox.classList.add('active');
                document.body.style.overflow = 'hidden'; }});});

    document.querySelectorAll('.preview-close').forEach((closeButton) => {
        closeButton.addEventListener('click', () => {
            const previewContainer = document.querySelector('.previews');
            const activeBox = document.querySelector('.preview.active');

            if (activeBox) { activeBox.classList.remove('active'); }
            previewContainer.style.display = 'none';
            document.body.style.overflow = 'auto'; }); }); })