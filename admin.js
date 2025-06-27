alert('ADMIN.JS IS WORKING!');

function goBackToMain() {
    window.location.href = 'index.html';
}

window.goBackToMain = goBackToMain;

document.addEventListener('DOMContentLoaded', function() {
    alert('DOM IS READY!');
    
    var tabs = document.querySelectorAll('.admin-tab-btn');
    var contents = document.querySelectorAll('.admin-tab-content');
    
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function() {
            var target = this.getAttribute('data-tab');
            
            for (var j = 0; j < tabs.length; j++) {
                tabs[j].classList.remove('active');
            }
            for (var k = 0; k < contents.length; k++) {
                contents[k].classList.remove('active');
            }
            
            this.classList.add('active');
            document.getElementById(target + 'Tab').classList.add('active');
        });
    }
    
    alert('TABS ARE WORKING!');
});

alert('ADMIN.JS LOADED SUCCESSFULLY!'); 