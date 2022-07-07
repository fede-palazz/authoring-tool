const HomeComponent = {
  render: () => {
    return `
        <section>
        <h1>Home</h1>
        <p>Laboris ex do id duis amet exercitation veniam ut deserunt in fugiat. Nisi mollit cillum sit ut tempor duis laboris ullamco adipisicing. Minim sint dolore aute deserunt laborum veniam cillum. Aliquip occaecat duis sunt in adipisicing voluptate ad dolor dolore dolore consectetur.</p>
      </section>
      `;
  },
  init() {
    document.querySelector('p').addEventListener('click', () => {
      console.log('Homepage event listener');
    });
    /**
     * Undo / Redo action event listener
     */
    document.addEventListener('keydown', undo);
  },
  destroy() {
    document.removeEventListener('keydown', undo);
  },
};

function undo(e) {
  if (e.ctrlKey && e.key === 'z') console.log('Undo');
  else if (e.ctrlKey && e.key === 'y') console.log('redo');
}

export { HomeComponent };
