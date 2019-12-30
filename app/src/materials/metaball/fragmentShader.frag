
precision highp float;
uniform vec3 metaballs[' + NUM_METABALLS + '];
const float WIDTH = ' + WIDTH + '.0;
const float HEIGHT = ' + HEIGHT + '.0;

void main(){
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    float v = 0.0;
    for (int i = 0; i < ' + NUM_METABALLS + '; i++) {
        vec3 mb = metaballs[i];
        float dx = mb.x - x;
        float dy = mb.y - y;
        float r = mb.z;
        v += r*r/(dx*dx + dy*dy);
    }
    if (v > 1.0) {
        gl_FragColor = vec4(x/WIDTH, y/HEIGHT,
                                0.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
