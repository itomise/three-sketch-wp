
var intarakai02Shader = {

	uniforms: {

    "tDiffuse": { value: null },
		"time": { value: 0.0 },

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

    "uniform sampler2D tDiffuse;",
		"uniform float time;",

		"varying vec2 vUv;",

		"void main() {",

    "vec2 zure = vec2(sin(vUv.y * 12.0 + 0.2 * 0.1) * 0.02, 0.0);",

    "vec2 noiseRed = vec2(sin(vUv.y * 9.0 + time * 0.01) * 0.03, 0.0);",
    "vec2 noiseGreen = vec2(sin(vUv.y * 13.0 + time * 0.01) * 0.03, 0.0);",
    "vec2 noiseBlue = vec2(sin(vUv.y * 11.0 + time * 0.01) * 0.01, 0.0);",

    "vec4 dest = texture2D(tDiffuse, vUv + zure);",

    "vec4 redDest = texture2D(tDiffuse, vUv + noiseRed);",
    "vec4 greenDest = texture2D(tDiffuse, vUv + noiseGreen);",
    "vec4 blueDest = texture2D(tDiffuse, vUv + noiseBlue);",

    "gl_FragColor = vec4(redDest.r, greenDest.g, blueDest.b, dest.a);",

		"}"

	].join( "\n" )

};

export { intarakai02Shader };
