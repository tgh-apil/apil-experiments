<script>
    import { push } from 'svelte-spa-router';
</script>

<div class="wrapper">
    <div class="split-container">
                <h2>Experiment Notes</h2>
        <ul>
            <li>Potential for high RAM usage</li>
            <li>Potential for high CPU/GPU usage</li>
            <li>High impact on battery drain</li>
            <li>High network use (some models are >15 mb)</li>
            <li>Public access to all messages</li>
            <li>Login required to post comments and markers</li>
            <li>Markers and messages appear in real-time for all users!</li>
            <li>Not mobile optimized</li>
        </ul>
        <h2>Tech Stack</h2>
        <ul>
            <li><a href="http://www.itksnap.org/">ITK-SNAP: organ segmentation</a></li>
            <li><a href="https://www.slicer.org/">3D Slicer: more organ segmentation</a></li>
            <li><a href="https://www.meshmixer.com/">Meshmixer: Model editing</a></li>
            <li><a href="https://www.blender.org/">Blender: Model texturing and compression</a></li>
            <li><a href="https://threejs.org/">three.js: model viewer</a></li>
            <li><a href="https://svelte.dev/">Svelte: front-end framework</a></li>
        </ul>
    </div>
    <div class="split-container">
        <h2>How to Use</h2>
        <p><strong>Controls:</strong></p>
        <ul>
            <li>Left click: pan</li>
            <li>Right click: rotate</li>
            <li>Mousewheel: zoom in/out</li>
        </ul>
        <p><strong>Collaboration options:</strong></p>
        <p>Login required to leave messages or markers</p>
        <ul>
            <li>Double click anywhere on the model to leave a maker with message</li>
            <li>Send a global message in the chatbox</li>
        </ul>
        <p>The markers and messages are persistent and can be viewed by all users.</p>
        <h2>Problem Space</h2>
        <p>There are a tonne of excellent 3D model viewers online.</p>
        <p>But, not all of them have the features we need:</p>
        <ul>
            <li>clipping planes</li>
            <li>toggle-able objects</li>
            <li>direct control of scene elements</li>
            <li>etc...</li>
        </ul>
        <p>Some viewers with most of these features are locked into specific file formats.</p>
        <p>Lastly, most 3D viewers treat the viewing experience as passive providing users with limited (or zero) options with each other and the models.</p>
        <ul>
            <li>Explore the models in a variety of ways</li>
            <li>Actively engage with the models and other users by leaving markers and messages</li>
        </ul>
    </div>
</div>

<div class="experiment-control-container">
    <span />
    <span />
    <button class="github-btn" on:click={() => location.href='http://github.com/tgh-apil'}>Experiment Repo</button>
    <button class="launch-btn" on:click={() => push('/3dviewer/viewer')}>Launch Experiment</button>
</div>

<style>

    .split-container {
        overflow: auto;
        height: 70vh;
        margin-right: 10px;
        margin-left: 10px;
    }

    .experiment-control-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 20px;
    }

    .experiment-control-container button {
        margin-left: 10px;
        margin-right: 10px;
    }

</style>