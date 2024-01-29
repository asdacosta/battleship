import './reset.css';
import './style.css';
// import './assets/###.mp4';

const importAllAssets = (function () {
  function importAll(r) {
    return r.keys().map(r);
  }

  const assets = importAll(require.context('./assets', false, /\.(png|jpe?g|svg)$/));
})();
