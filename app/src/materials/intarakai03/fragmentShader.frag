#define PI 3.14159265359


varying vec2 vUv;
uniform float time;
uniform vec2 resolution;

mat2 rot(float a)
{
 return mat2(cos(a*3.2), sin(a*5.), -sin(a*7.5), cos(a));
}
void main( void )
{
	vec2 p = gl_FragCoord.xy - vec2(0.9, 0.9);
	p -= 0.4 * resolution;
	p /= resolution.y;
	p *= rot(0.5 / length(p) + time/2.);
	gl_FragColor = vec4( length(0.9 * p ) );
}
