import '../css/base.scss'


// import './bufferGeo'

// import './maskSphere'

// import './postProcess-trial01'

// import './metaballs'

// import './postProcess-trial02'

<<<<<<< HEAD
// import './effectsStereo'

import './cameraArray'
=======
import './intarakai01'
>>>>>>> b1fdccaa07ee5efed7dc178e6d67454bc9cd9dfb

// pugをインポートする
const req = require.context('../pug/', false, /\.pug/);
req.keys().forEach((fileName) => {
  req(fileName);
});

// HMRに失敗してもJSがリロードしてくれないので強制的にリロードを実行する
if (module.hot) {
  module.hot.accept(console.error);
  module.hot.dispose(() => {
    window.location.reload();
  });
}
