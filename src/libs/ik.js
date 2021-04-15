// (almost) direct conversion from josh's ik python script
// https://github.com/jquahian/print_harvester/blob/main/ik.py

export let j1_j2_length;
export let j2_j3_length;
export let j3_j4_length;
export let j4_tcp_length;

const j3_tcp_length = j3_j4_length + j4_tcp_length;

// double check which axis is 'up' in 3js
export default function ik(x, y, z) {
    // projection of arm on XY plane
    const xy_projection_length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    // distance from j1_j2 to the end-effetor z-position
    const r3 = z - j1_j2_length;

    const j2_effector_length = Math.sqrt(Math.pow(xy_projection_length, 2) + Math.pow(r3, 2));

    // find rotation of joint #1 in degrees
    const j1_theta_rads = Math.round(Math.asin(x/xy_projection_length), 3);
    const j1_theta = radToDeg(j1_theta_rads);

    // find angle between joint length 2 and joint length 3
    const phi_3 = Math.acos((Math.pow(j3_tcp_length, 2) - Math.pow(j2_j3_length, 2) - Math.pow(j2_effector_length/2))) / (-2 * j2_j3_length * j2_effector_length);

    // rotation of joint 3 in degrees
    const j3_theta = Math.round(radToDeg(degToRad(180) - phi_3), 3);

    // angle between j2_effector and horizontal x-axis
    const phi_2 = Math.acos((Math.pow(j3_tcp_length, 2) - Math.pow(j2_j3_length, 2) - Math.pow(j2_effector_length, 2))) / Math.pow(-2 * j2_j3_length * j2_j3_length);

    // angle between the j2_effector and the vertical z-axis
    const phi_1 = Math.asin((z - j1_j2_length) / j2_effector_length);

    // find rotation of joint 2 in degrees -- relative to the horizontal x-axis in
    const j2_theta = Math.round(radToDeg(phi_2 + phi_1 + degToRad(90)), 3);

    // determine correct coangle depending on motor configuration
    let j1_theta_motor = (Math.round(90 - j1_theta, 3));

    if (y < 0) {
        j1_theta_motor = -j1_theta_motor;
    }

    const j2_theta_motor = Math.round(180 - j2_theta, 3);
    const j3_theta_motor = Math.round(j3_theta, 3);

    // needs a limit check

    let angles = {
        'theta_1': j1_theta_motor,
        'theta_2': j2_theta_motor,
        'theta_3': j3_theta_motor,
    }
    console.table(angles);

    return angles;
}

function radToDeg(rads) {
    const degrees = rads * 180 / Math.PI
    return degrees;
}

function degToRad(degs) {
    const rads = degs * Math.PI / 180;
    return rads;
}