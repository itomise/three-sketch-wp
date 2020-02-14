

var MyNoiseShader = {

	uniforms: {},

	vertexShader: [

    "uniform float u_time;",

		"void main() {",

    "vec3 newPos = position;",
    "newPos.x += sin(position.y + u_time) * 0.3;",
    "newPos.y += cos(position.x + u_time * 0.4) * 0.3;",

		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

    "uniform float u_time;",

		"void main() {",

		"	gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );",

		"}"

	].join( "\n" )

};

export { MyNoiseShader };
