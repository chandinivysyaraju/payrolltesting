var dappCall = require('../utils/dappCall');
var links = require('../utils/constants').links;

app.route.post('/findDappsByAddress', async function(req, cb){
    var address = req.query.address;
    var result = await app.model.Issueaddr.findAll({
        condition: {
            address: address
        }
    });
    return result;
})

app.route.post('/mapAddress', async function(req, cb){
    var address = req.query.address;
    var dappid = req.query.dappid;
    var check = await app.model.Issueaddr.exists({
        address: address,
        dappid: dappid
    });
    if(check) return 0;
    app.sdb.create('issueaddr', {
        address: address,
        dappid: dappid
    });
    return 1;
})

app.route.post('/user/getDappsByAddress', async function(req, cb){
    var resultArray = [];
    var result = await app.model.Issueaddr.findAll({
        condition: {
            address: req.query.address
        },
        fields: ['dappid']
    });
    for(i in result){
        var company = await app.model.Company.findOne({
            condition: {
                dappid: result[i].dappid
            }
        });
        result[i].company = company.company;
    }
    return result;
});

app.route.post('/mapUser', async function(req, cb){
    var options = {
        email: req.query.email,
        dappid: req.query.dappid,
        role: req.query.role
    }
    
    var check = await app.model.Mapping.exists({
        email: req.query.email
    });
    if(check) return {
        message: "Email already Registered with Payroll",
        isSuccess: false
    }
    
    app.logger.log("About to create a mapping with options: " + JSON.stringify(options));
    app.sdb.create('mapping', options);
    return {
        isSuccess: true
    };
})

// app.route.post('/dappreg', async function (req, res) {

    
//     console.log(JSON.stringify(response)); 
//     if(response && !response.success) {
//         console.log("failed");
//       return response;   
//     }
//     else if(response.success===true){
//     console.log("Entering dapp install");
//     await sleep(5000);
//     var dappid=response.transaction.id;
//     console.log(response.transaction.id);
//     var install_params={
//             id:dappid,
//             master:"ytfACAMegjrK"
//     }

//     var response1 = await dappCall.call('POST', `/api/dapps/install`, install_params);
//     console.log(JSON.stringify(response1));
//     if(response1 && !response1.success) {
//       return response1;        
//     }
//     else{
//         console.log("Entering Dapp launch");
//         await sleep(5000);
//         var response2 = await dappCall.call('POST', `/api/dapps/launch`, install_params);
//       console.log(JSON.stringify(response2)); 
//     if(response2 && !response2.success) {
//         return response2;   
//     }
//     else{
//         var email=req.query.email;
//             app.sdb.create('mapping', {
//                 email:email,
//                 role:"superuser"
//             });
//         console.log("registered");
//         var result={
//             dappid:dappid,
//             response:"registered"
//         }
//     return result;
//     }
// }
//     }
   
// });

function getRandomString() {
    var text = "";
    var caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var smalls = "abcdefghijklmnopqrstuvwxyz";
    
    for (var i = 0; i < 4; i++){
        text += caps.charAt(Math.floor(Math.random() * caps.length));
        text += smalls.charAt(Math.floor(Math.random() * smalls.length));
    }
    return text;
}

module.exports.registerDapp = async function (req, res) {
    console.log("Entering dapp registration");
    app.logger.log("******** Entering dapp registration ********");
    
    var randomText = getRandomString();
    randomText += ".zip";
    
    var link = "http://52.201.227.220:8080/sendzip/" + randomText;
    if(req.query.assetType === "certificate") link = "http://52.201.227.220:8080/sendzip2/" + randomText;
    var dapp_params = {
        secret: req.query.secret,
        category: 1,
        name:req.query.name,
        description: req.query.des,
        type: 0,
        link: link,
        icon: "http://o7dyh3w0x.bkt.clouddn.com/hello.png",
        delegates: [
        "db18d5799944030f76b6ce0879b1ca4b0c2c1cee51f53ce9b43f78259950c2fd",
    	"590e28d2964b0aa4d7c7b98faee4676d467606c6761f7f41f99c52bb4813b5e4",
    	"bfe511158d674c3a1e21111223a49770bee93611d998e88a5d2ea3145de2b68b",
    	"7bbf62931cf3c596591a580212631aff51d6bc0577c54769953caadb23f6ab00",
		"452df9213aedb3b9fed6db3e2ea9f49d3db226e2dac01828bc3dcd73b7a953b4"
        ],
        unlockDelegates: 3,
        countryCode: "IN"
    };
    console.log(JSON.stringify(dapp_params));
    var response = await dappCall.call('PUT', `/api/dapps`, dapp_params);
    
    if(!response.success) return response;
    
    var email=req.query.email;
    var company=req.query.company;
    var name=req.query.name;
    var country=req.query.country;
    var  dappid=response.transaction.id;
    // app.sdb.create('mapping', {
    //     email:email,
    //     dappid:dappid,
    //     role:"superuser"
    // });
    app.sdb.update('mapping', {dappid: dappid}, {email: email});
    app.sdb.update('mapping', {role: 'superuser'}, {email: email});
    app.sdb.create('company',{
        dappid:dappid,
        company:company,
        country:country,
        name:name,
        timestampp: new Date().getTime().toString()
    });
    return response;
}

module.exports.installDapp = async function (req, res) {
    console.log("Entering dapp install");
    app.logger.log("******* Entering dapp install ********");
    
    var dappid=req.query.id;
    var install_params={
        id:dappid,
        master:"ytfACAMegjrK"
    }
    return await dappCall.call('POST', `/api/dapps/install`, install_params);
}

module.exports.launchDapp = async function (req, res) {
    console.log("Entering dapp launch");
    app.logger.log("******* Entering dapp launch ********");
    
    var dappid=req.query.id;
    var install_params={
        id:dappid,
        master:"ytfACAMegjrK"
    }
    return await dappCall.call('POST', `/api/dapps/launch`, install_params);
}

app.route.post('/registerDApp', module.exports.registerDapp);
app.route.post('/installDApp', module.exports.installDapp);
app.route.post('/launchDApp', module.exports.launchDapp);

app.route.post('/makeDapp', async function(req, cb){

    function sleep(ms){
        return new Promise(resolve=>{
            setTimeout(resolve,ms)
        })
    }

    console.log("Started Dapp Register");
    var dappRegisterResult = await module.exports.registerDapp(req, cb);
    console.log("Dapp register result: " + JSON.stringify(dappRegisterResult));

    if(!dappRegisterResult) return "No response from Dapp registration call";
    if(!dappRegisterResult.success) return dappRegisterResult;

    console.log("Dapp successfully registered");

    console.log("About to do Dapp install");
    var count = 0;
    var installreq = {
        query: {
            id: dappRegisterResult.transaction.id
        }
    }
    do{
        await sleep(2000);
        console.log("Install Attempt: " + ++count);
        var dappInstallResult = await module.exports.installDapp(installreq, 0);
        if(count > 15) return {
            isSuccess: false,
            message: "Failed at Installation with error: " + JSON.stringify(dappInstallResult),
            dappid: installreq.query.id
        }
    }while(!dappInstallResult.success);

    console.log("About to launch dapp");
    count = 0;

    do{
        await sleep(2000);
        console.log("Launch Attempt: " + ++count);
        var dappLaunchResult = await module.exports.launchDapp(installreq, 0);
        if(count > 15) return {
            isSuccess: false,
            message: "Failed at Launch with error: " + JSON.stringify(dappInstallResult),
            dappid: installreq.query.id
        }
    }while(!dappLaunchResult.success);
    console.log("Finished Dapp launch");
    return {
        isSuccess: true,
        message: "Successfully Installed",
        dappid: installreq.query.id
    }
});

app.route.post('/mockCompany', async function(req, cb){
    app.sdb.create('company', {
        dappid: req.query.dappid,
        company: req.query.company,
        country: req.query.country,
        name: req.query.name
    });
})

app.route.post('/removeUsers', async function(req, cb){
    console.log("Here in SuperDapp remove: " + JSON.stringify(req)); 
    app.sdb.del('mapping', {
        email: req.query.email
    });
    return {
        isSuccess: true
    }
})


 app.route.post('/getPayedPayslip', async function(req, cb){
     var company = await app.model.Company.findOne({
         condition: {
             dappid: req.query.dappid
         }
     });

     if(!company) return {
         message: "Invalid company",
         isSuccess: false
     }

     var link = links.centralServer + '/payslip/' + req.query.random + '/' + req.query.dappid + '/' + req.query.hash;
     var response = await dappCall.call('POST', '/api/dapps/' + req.query.dappid + '/getPayedPayslip', {hash: req.query.hash, link: link, dappid: req.query.dappid});

     if(!response) return {
         message: "No response from the dapp",
         isSuccess: false
     }

     return response;
     
 })

 app.route.post('/generatePayslipLink', async function(req, cb){
     var dappcheck = await app.model.Company.findOne({
         condition: {
             dappid: req.query.dappid
         }
     });
     if(!dappcheck) return {
         message: "Invalid dapp id",
         isSuccess: false
     }

     var link = links.centralServer + '/payslip/' + getRandomString() + '/' + req.query.dappid;
     var response = await dappCall.call('POST', '/api/dapps/' + req.query.dappid + '/generatePayslipLink', {
         pid: req.query.pid,
         link: link,
         days: req.query.days,
         email: req.query.email
    });

    if(!response) return {
        message: "No response from dapp",
        isSuccess: false
    }

    return response;
 })

// dappid:"2b06d8d5f5b1184e4c2813a3e3dafe389287012ebc7f690e7d26863ad6ed95be"