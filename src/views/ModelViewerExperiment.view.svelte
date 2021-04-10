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
            <li>Potential high network use (some models are >15 mb)</li>
            <li>Public access to all materials</li>
            <li>Login required to post comments and markers</li>
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
            <li>Actively engage with the models and other users by leaving markers and comments</li>
        </ul>
        <h2>How to Use</h2>
        <p>Launch this experiment.  A new page will load with a list of 3D models.</p>
        <p>Click on any of the models and the collaborative 3D viewer will load.</p>
        <p>Controls:</p>
        <ul>
            <li>Left click: pan</li>
            <li>Right click: rotate</li>
            <li>Mousewheel: zoom in/out</li>
        </ul>
        <p>You can leave a global comment for each model, and you can double click anywhere on the model to leave a marker with a region specific comment.</p>
        <p>Use these markers to highlight points of interest on the model.</p>
        <p>Remember: the markers are persistent and can be viewed by all users.</p>
        <p>To delete a marker, just double click it.</p>
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