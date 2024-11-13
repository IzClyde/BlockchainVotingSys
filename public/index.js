const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
const abi = [
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "presidentNames",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "vicePresidentNames",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "secretaryNames",
				"type": "string[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TransferToOwner",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "position",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "candidateIndex",
				"type": "uint256"
			}
		],
		"name": "VoteCasted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "position",
				"type": "string"
			}
		],
		"name": "getCandidateCountForPosition",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "position",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getCandidateForPosition",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "voteCount",
						"type": "uint256"
					}
				],
				"internalType": "struct Voting.Candidate",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "position",
				"type": "string"
			}
		],
		"name": "getCandidates",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "voteCount",
						"type": "uint256"
					}
				],
				"internalType": "struct Voting.Candidate[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "candidateIndex",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "position",
				"type": "string"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "voteFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let web3;
let contract;
let currentAccount;

window.addEventListener('load', async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(abi, contractAddress);
        await connectWallet();
    } else {
        alert('Please install MetaMask to use this DApp');
    }
});

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        document.getElementById('walletAddress').innerText = `Wallet: ${currentAccount}`;

        // Fetch and display wallet balance
        const balance = await web3.eth.getBalance(currentAccount);
        const balanceInEth = web3.utils.fromWei(balance, 'ether');
        document.getElementById('walletBalance').innerText = `Your Balance: ${balanceInEth} ETH`;

        // Display candidates after wallet connection
        await displayCandidates();
    } catch (error) {
        console.error("Error connecting to wallet:", error);
    }
}

async function displayCandidates() {
    const positions = ["President", "Vice President", "Secretary"];
    const candidateListDiv = document.getElementById('candidateList');
    candidateListDiv.innerHTML = ''; // Clear previous candidates
	
    for (const position of positions) {
        const candidateCount = await contract.methods.getCandidateCountForPosition(position).call();

        const positionHeader = document.createElement('h4');
        positionHeader.innerText = position;
        candidateListDiv.appendChild(positionHeader);

        // Fetch and display each candidate for the current position
        for (let i = 0; i < candidateCount; i++) {
            const candidate = await contract.methods.getCandidateForPosition(position, i).call();
            candidateListDiv.innerHTML += `
                <div class="candidate">
                    <span>${candidate.name}</span>
                    <button onclick="vote(${i}, '${position}')">Vote</button>
                </div>`;
        }
    }
}


async function vote(candidateIndex, position) {
    try {
        console.log("Voting for candidate index:", candidateIndex, "Position:", position);
        console.log("Contract methods:", Object.keys(contract.methods));

        // Check if the candidate index is valid
        const candidateCount = await contract.methods.getCandidateCountForPosition(position).call();
        console.log("Candidate count for", position, ":", candidateCount);
        if (candidateIndex >= candidateCount) {
            throw new Error('Invalid candidate index');
        }

        // Check if the user has already voted for this position
        const hasVoted = await contract.methods.voters(currentAccount, position).call();
        console.log("Has voted:", hasVoted);
        if (hasVoted) {
            throw new Error('You have already voted for this position');
        }

        // Prepare transaction parameters
        const voteFee = web3.utils.toWei('0.1', 'ether');
        const gasPrice = await web3.eth.getGasPrice();
        console.log("Current gas price:", gasPrice);

        // Estimate gas for the transaction
        const gasEstimate = await contract.methods.vote(candidateIndex, position).estimateGas({
            from: currentAccount,
            value: voteFee
        });
        console.log("Estimated gas:", gasEstimate);

        // Execute the vote transaction
        const transaction = await contract.methods.vote(candidateIndex, position).send({
            from: currentAccount,
            value: voteFee,
            gas: Math.floor(gasEstimate * 1.2), // 20% buffer
            gasPrice: gasPrice, 
			nonce: await web3.eth.getTransactionCount(currentAccount)
        });

        console.log('Vote transaction:', transaction);
        alert(`You successfully voted for ${position} candidate at index ${candidateIndex}.`);

        // Refresh the candidate display after voting
        await displayCandidates();

    } catch (error) {
        console.error('Error during voting:', error);
        if (error.message.includes('execution reverted')) {
            const reason = error.message.split('execution reverted:')[1].trim();
            alert(`Transaction failed: ${reason}`);
        } else {
            alert('Transaction failed: ' + error.message);
        }
    }
}




async function getResults() {
    const votingResultsDiv = document.getElementById('votingResults');
    votingResultsDiv.innerHTML = ''; // Clear previous results
    const positions = ["President", "Vice President", "Secretary"];

    for (const position of positions) {
        const candidateCount = await contract.methods.getCandidateCountForPosition(position).call();
        const positionHeader = document.createElement('h4');
        positionHeader.innerText = position;
        votingResultsDiv.appendChild(positionHeader);

        for (let i = 0; i < candidateCount; i++) {
            const candidate = await contract.methods.getCandidateForPosition(position, i).call();
            votingResultsDiv.innerHTML += `<div>${candidate.name}: ${candidate.voteCount} votes</div>`;
        }
    }
}