// Script to make Cloud Run service public using Google Cloud APIs
const { exec } = require('child_process');

// Function to execute shell commands
function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            console.log(`Output: ${stdout}`);
            resolve(stdout);
        });
    });
}

async function makeApiPublic() {
    try {
        console.log('🔧 Making API service publicly accessible...');
        
        // Use gcloud to make the service public
        const command = 'gcloud run services add-iam-policy-binding api --region=us-central1 --member="allUsers" --role="roles/run.invoker" --project=pg-walebhaiya';
        
        console.log('Running command:', command);
        await runCommand(command);
        
        console.log('✅ API service is now publicly accessible!');
        console.log('🚀 You can now test the setup-admin endpoint');
        
    } catch (error) {
        console.error('❌ Failed to make API public:', error.message);
        console.log('\n📋 Manual steps:');
        console.log('1. Go to: https://console.cloud.google.com/run');
        console.log('2. Click on "api" service');
        console.log('3. Go to "Permissions" tab');
        console.log('4. Click "Add Principal"');
        console.log('5. Add "allUsers" with role "Cloud Run Invoker"');
        console.log('6. Save changes');
    }
}

makeApiPublic();
