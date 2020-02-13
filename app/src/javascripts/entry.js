import '../css/base.scss'


// import './bufferGeo'

// import './maskSphere'

// import './postProcess-trial01'

// import './metaballs'

// import './postProcess-trial02'

// import './effectsStereo'

// import './cameraArray'

// import './intarakai01'

// import './intarakai02'

// import './cubemap'

// import './intarakai03'

// import './intarakai04'

// import './itomise'

// import './itomise01'

// import './itomise02'

// import './maskingPanda'

// import './maskingPanda01'

// import './maskPanda02'

// import './postProcessingPixel'

import './maskingNoise'

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
