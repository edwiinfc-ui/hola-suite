const fs = require('fs');
let content = fs.readFileSync('vylex.html', 'utf8');

const sortableLogic = `function applySortableGrids() {
  const grids = document.querySelectorAll('.kpi-grid, .charts-grid');
  grids.forEach((grid, index) => {
    if(grid.dataset.sortableInit) return;
    grid.dataset.sortableInit = '1';
    
    const storeKey = 'holaGridOrder_' + (grid.id || 'grid_' + index);
    
    Array.from(grid.children).forEach((child, i) => {
      if(!child.dataset.id) child.dataset.id = child.id || 'item_' + i;
    });

    const saved = localStorage.getItem(storeKey);
    if(saved) {
      try {
        const order = JSON.parse(saved);
        const frag = document.createDocumentFragment();
        order.forEach(id => {
          const el = grid.querySelector(\`[data-id="\${id}"]\`);
          if(el) frag.appendChild(el);
        });
        Array.from(grid.children).forEach(child => {
          if(!order.includes(child.dataset.id)) frag.appendChild(child);
        });
        grid.appendChild(frag);
      } catch(e) {}
    }

    if(window.Sortable) {
      Sortable.create(grid, {
        animation: 150,
        handle: grid.classList.contains('charts-grid') ? '.chart-header' : null,
        onEnd: function() {
          const order = Array.from(grid.children).map(c => c.dataset.id);
          localStorage.setItem(storeKey, JSON.stringify(order));
        }
      });
      if(grid.classList.contains('charts-grid')){
        grid.querySelectorAll('.chart-header').forEach(h => { h.style.cursor = 'grab'; h.title = 'Arrastra para reordenar'; });
      } else {
        grid.querySelectorAll('.kpi-card').forEach(c => { c.style.cursor = 'grab'; c.title = 'Arrastra para reordenar'; });
      }
    }
  });
}
`;

content = content.replace("window.addEventListener('load',()=>{\n", sortableLogic + "\nwindow.addEventListener('load',()=>{\n  applySortableGrids();\n");

fs.writeFileSync('vylex.html', content);
console.log('Sortable logic injected.');
