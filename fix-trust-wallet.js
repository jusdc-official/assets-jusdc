const fs = require('fs');
const path = require('path');

// JUSDC token data for all chains
const chains = [
    {
        name: 'ethereum',
        address: '0x3a4184028de3f2B2fB63d596ec9101328aC7A736',
        decimals: 18,
        explorer: 'https://etherscan.io/token/'
    },
    {
        name: 'polygon', 
        address: '0xFfF13F7Df6db0811A45b162D5CA742f970888eE0',
        decimals: 6,
        explorer: 'https://polygonscan.com/token/'
    },
    {
        name: 'base',
        address: '0xfF9dEfDB71e9aeBA1FAAB543c5e2989f5eFc152A',
        decimals: 18, 
        explorer: 'https://basescan.org/token/'
    }
];

function createInfoJson(chainData) {
    const lowercaseAddress = chainData.address.toLowerCase();
    
    return {
        "name": "JUSDC",
        "website": "https://jusdc-vault.vercel.app/",
        "description": "JUSDC is a fully backed digital cash token issued by CashMatrix, providing secure and transparent RWA settlement and DeFi interoperability.",
        "explorer": chainData.explorer + chainData.address,
        "type": "ERC20",
        "symbol": "JUSDC", 
        "decimals": chainData.decimals,
        "status": "active",
        "id": lowercaseAddress
    };
}

// Create folders and files for each chain
chains.forEach(chain => {
    const lowercaseAddress = chain.address.toLowerCase();
    const chainFolder = path.join('blockchains', chain.name, 'assets', lowercaseAddress);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(chainFolder)) {
        fs.mkdirSync(chainFolder, { recursive: true });
        console.log(`Created folder: ${chainFolder}`);
    }
    
    // Create info.json
    const infoJson = createInfoJson(chain);
    fs.writeFileSync(path.join(chainFolder, 'info.json'), JSON.stringify(infoJson, null, 2));
    console.log(`Created info.json for ${chain.name}`);
    
    // Copy logo.png (you need to have logo.png in root directory)
    const logoSource = 'logo.png';
    if (fs.existsSync(logoSource)) {
        fs.copyFileSync(logoSource, path.join(chainFolder, 'logo.png'));
        console.log(`Copied logo.png to ${chain.name}`);
    }
});

console.log('✅ All JUSDC token files created successfully!');
