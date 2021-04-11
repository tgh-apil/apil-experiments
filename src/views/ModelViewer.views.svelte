<script>
    import { tick } from 'svelte';
    import { push } from 'svelte-spa-router';
    import { hasPopup, modelDoc } from '../stores';
    import firebase from 'firebase/app';
    import 'firebase/storage';
    import { db } from '../firebase';

    // components
    import ModelViewer from '../components/ModelViewer.component.svelte';
    import CommentBox from '../components/CommentBox.component.svelte';
    import Card from '../components/Card.component.svelte';
    
    const storageRef = firebase.storage().ref();
    const modelDirRoot = storageRef.child('apil-3d-models');

    let modelToShow;
    let modelThumbnail;
    
    let popup = false;

    getModelsInStorage();

    let modelList = [];
    
    // find all models in the root directory and add to array
    async function getModelsInStorage() {
        await modelDirRoot.listAll()
            .then((res) => {
                // gets subdirectories
                res.prefixes.forEach(async (folderRef) => {
                    // gets files in subdirectories
                    await folderRef.listAll()
                        .then((res) => {
                            res.items.forEach((itemRef) => {
                                if (itemRef.name.slice(-3) === 'glb') {
                                    modelList.push(itemRef);
                                }
                            })
                        })
                })
            });

        getModelData();
    }

    // for every model in the modelList, get a corresponding database entry
    let modelDataList = [];

    async function getModelData() {
        const modelDataRef = db.collection('models');
        const snapshot = await modelDataRef.get();

        snapshot.forEach(doc => {
            modelDataList.push(doc.data());
            modelDataList = modelDataList;
        });

        createModelObjectList();
    }

    let modelObjectList = [];

    async function createModelObjectList() {
        console.log(modelDataList);
        let modelStorageList = [];

        modelList.forEach(model => {
            modelStorageList.push(model.name);
        })

        modelDataList.forEach(async modelData => {
            if (modelStorageList.includes(modelData.fileName)) {
                let thumbnailPath = modelData.filePath + 'thumbnail.png';

                await storageRef.child(thumbnailPath).getDownloadURL()
                    .then((url) => {
                        modelThumbnail = url;
                    })
                    .catch((err) => {
                        console.log(`${err} No thumbnail exists for this model`);
                    });

                let modelObject = {
                    thumbnail: modelThumbnail,
                    docId: modelData.docId,  
                    title: modelData.title,
                    filePath: modelData.filePath + modelData.fileName,
                    description: modelData.description,
                } 
                modelObjectList.push(modelObject);
            } else {
                let modelObject = {
                    thumbnail: '../images/no_img_set.png',
                    docId: 'none',
                    title: model.name,
                    filePath: model.fullPath,
                    description: 'no description yet!',
                }
                modelObjectList.push(modelObject);
            }
            listSort();
        })
    }

    // check if thumbnail exists for our model
    async function getThumbnail() {
        modelList.forEach(async model => {
            let thumbnailPath = model.fullPath.slice(0, -model.name.length) + 'thumbnail.png';
            await storageRef.child(thumbnailPath).getDownloadURL()
                .then((url) => {
                    modelThumbnail = url;
                })
                .catch((err) => {
                    modelThumbnail = '../images/no_img_set.png';
                    console.log(`${err} No thumbnail exists for this model`);
                });
        })
    }

    function listSort() {
        modelObjectList.sort((a, b) => {
            let aTitle = a.title.toUpperCase();
            let bTitle = b.title.toUpperCase();
            
            if (aTitle < bTitle) {
                return -1
            } else {
                return 1
            }
        });

        modelObjectList = modelObjectList;
    }

    let modelDocId, modelTitle, modelDescription;

    async function setModel(docId, path, title, descriptionToShow) {
        await storageRef.child(path).getDownloadURL()
        .then((url) => {
            modelToShow = url;
        })

        modelTitle = title;
        modelDescription = descriptionToShow;
        modelDoc.update(src => src = docId);

        popup = true;
        hasPopup.update(src => src = true);
    }

    function popupViewer() {
        // not happy with this but it stops the memory leak
        location.reload();
        hasPopup.update(src => src = false);
    }

</script>

<div class="container">
    <div>
        <h1>COLLABORATIVE VIEWER</h1>
    </div>
    <div>
        <div class="wrapper">
            <div class="file-list-container">
                {#each modelObjectList as model}
                    <div class="card-container" on:click={setModel(model.docId, model.filePath, model.title, model.description)}>
                        <Card picturePath={model.thumbnail} altText={`screenshot of ${model.title}`} title={model.title} />
                    </div>
                {/each}
            </div>
        </div>
        <div>
            <button on:click={() => push('/3dviewer/')}>Back to Experiment Overview</button>
        </div>
    </div>
    {#if popup}
        <div class="viewer-container">
            <div class="model-title-container">
                <h3>{modelTitle}</h3>
            </div>
            <div class="viewer">
                <ModelViewer modelToShow={modelToShow} />
            </div>
            <div class="info-container">
                <div class="description-container">
                    <p>{modelDescription}</p>
                </div>
                <div class="comment-box-container">
                    {#if $modelDoc != 'none'}
                        <CommentBox />
                    {:else}
                        <p>This model does not have a database entry</p>
                    {/if}
                </div>
            </div>
            <div>
                <button on:click={popupViewer}>Back to Model List</button>
            </div>
        </div>
    {/if}
</div>

<style>

    .container {
        width: 100%;
        position: relative;
    }

    .file-list-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 260px));
        gap: 2px;
    }

    .card-container {
        display: grid;
        align-items: center;
        justify-items: center;
        height: 100%;
        border: 5px solid transparent;
        transition: all;
        transition-duration: 200ms;
    }

    .card-container:hover {
        border: 5px solid #fff;
    }

    .viewer-container {
        background-color: #0e0e0e;
        width: 100%;
        height: 100%;
        z-index: 0;
        position: absolute;
        top: 0;
        left: 0;
    }

    .viewer-container button {
        font-size: 16px;
        position: absolute;
        margin-left: auto;
        margin-right: 0;
        cursor: pointer;
    }

    .viewer-container h3 {
        position: absolute;
        margin-left: auto;
        margin-right: 0;
        top: 60vh;
    }

    .info-container {
        background-color: #0e0e0e;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        grid-gap: 20px;
        margin-bottom: 10px;
    }

    .description-container {
        height: 24vh;
        overflow: auto;
    }

    .description-container p {
        font-size: 14px;
    }

    .model-title-container h3{
        background-color: #0e0e0e;
        position: absolute;
        top: 55vh;
        left: 0;
    }

</style>