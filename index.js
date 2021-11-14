import metaversefile from 'metaversefile';
const {useApp, useScene, getNextInstanceId, useCleanup} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

let eyeblasterApp = null;
let textApp = null;
let subApps = [null, null];
export default () => {
    const app = useApp();
    app.name = "title-card"

    const scene = useScene();

    {
        (async ()=>{
            let u2 = `https://sirahi.github.io/title-card-text/`
            if (/^https?:/.test(u2)) {
                u2 = '/@proxy/' + u2;
            }

            const m = await metaversefile.import(u2);

            textApp = metaversefile.createApp({
                start_url: u2,
            });

            textApp.contentId = u2;
            textApp.instanceId = getNextInstanceId();
            textApp.position.copy(app.position);
            textApp.quaternion.copy(app.quaternion);
            textApp.scale.copy(app.scale);
            textApp.updateMatrixWorld();
            textApp.name = 'text';

            subApps[1] = textApp;
      
            await textApp.addModule(m);
            scene.add(textApp);
        })();
    }
    
    {
        (async () => {
            let u2 = `${baseUrl}eyeblaster.gltj`;
            if (/^https?:/.test(u2)) {
                u2 = '/@proxy/' + u2;
            }
    
            const m = await metaversefile.import(u2);
            
            eyeblasterApp = metaversefile.createApp({
                start_url: u2,
            });
    
            eyeblasterApp.contentId = u2;
            eyeblasterApp.instanceId = getNextInstanceId();
            eyeblasterApp.position.copy(app.position);
            eyeblasterApp.quaternion.copy(app.quaternion);
            eyeblasterApp.scale.copy(app.scale);
            eyeblasterApp.updateMatrixWorld();
            eyeblasterApp.name = 'eyeblaster';

            subApps[0] = eyeblasterApp;
      
            await eyeblasterApp.addModule(m);
            scene.add(eyeblasterApp);
        })();
    }

    useCleanup(()=>{
        for (const subApp of subApps) {
            if (subApp) {
                scene.remove(subApp);
                subApp.destroy();
            }
        }
    });

    return app;
}