<script>
    export let picturePath;
    export let altText;
    export let title;

    if (picturePath === '') {
        picturePath = '../../images/no_img_set.png'
    }

</script>

<div class="card">
    <div class="card-content">
        <div class="thumbnail-container">
            <img src={picturePath} alt={altText} width="200" height="200">
        </div>
        <div class="title-container">
            <h3>{ title }</h3>
        </div>
    </div>
</div>

<style>

    .card { 
        color: #000;
        width: 200px;
        height: 200px;
        position: relative;
        cursor: pointer;
    }

    .title-container {
        position: absolute;
        left: 5px;
        bottom: 0;
    }

    .title-container h3 {
        color: #fff;
        font-size: 14px;
    }

    .thumbnail-container {
        position: relative;
        z-index: -1;
    }

</style>