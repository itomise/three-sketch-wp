import '../css/base.scss'


// import './bufferGeo'

// import './maskSphere'

// import './postProcess-trial01'

// import './metaballs'

// import './postProcess-trial02'

import './intarakai01'

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
