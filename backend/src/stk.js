import axios from "axios";

const token = "eyJ4NXQiOiJNell5TlRrMVpEZ3laVFEyTmpBMlpUSXlNR1V5Wm1Rek5qZzFNVEV4TlRjeE16RTRPVGsyT0ROa1pERm1PVGRsWVRsa1ltUTNOVFpsTWpZMlltVTBPUSIsImtpZCI6Ik16WXlOVGsxWkRneVpUUTJOakEyWlRJeU1HVXlabVF6TmpnMU1URXhOVGN4TXpFNE9UazJPRE5rWkRGbU9UZGxZVGxrWW1RM05UWmxNalkyWW1VME9RX1JTMjU2IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJTYW5kQm94VGVzdEBjYXJib24uc3VwZXIiLCJhdWQiOiJ0aGlGUFNVd082RWNMREk4ZmRSbE9oVVhBdFFhIiwibmJmIjoxNzYzMTE1Njk2LCJhenAiOiJ0aGlGUFNVd082RWNMREk4ZmRSbE9oVVhBdFFhIiwic2NvcGUiOiJhbV9hcHBsaWNhdGlvbl9zY29wZSBkZWZhdWx0IiwiaXNzIjoiaHR0cHM6XC9cL2RldmVsb3Blci5jby1vcGJhbmsuY28ua2U6OTQ0M1wvb2F1dGgyXC90b2tlbiIsImV4cCI6MTc2MzExOTI5NiwiaWF0IjoxNzYzMTE1Njk2LCJqdGkiOiIyMjEwNWY4Ni1lNzExLTQ1NzYtOWRmNy0xOGEzMzUzNTBjY2EifQ.BOK-RQKWWqa1jkvadkjA1iVuAqeh1SJcFLT1_vUIEjI38TEfLhBx0RoQuSr6j4VBXo9V3-a4UwENMdLqk_fcl1resNRotsjyBRlzidkLTa3mlqq5tGDLIg6Lc5fUWg2hdY2MqM-Typi88PiUQjf1LcNGn7nbk7l0wc3dTKR6LM94A5_AUTTer-2_TR-DZItIf7griYF9wck6YS5zwSXq3kvgQt-2fa0IlZTr-cyUffRsxBOWpl6XlQkuAOTDxkhL0w7PN2USYGAHq32nP2nhSPZoN5HHnzhE4mW0tZdduU0eC8kimPuKTx023KcdmnA44GXJHiE7XMAzmBaSQRjpRg";

const STK_PUSH_URL = "https://openapi-sandbox.co-opbank.co.ke/v1/stkpush/safaricom/";

async function sendSTKPush() {
  try {
    const payload = {
      MessageReference: "TestRef_" + Date.now(),
      TargetMSISDN: "254700000000",
      CallBackUrl: "https://example.com/callback", 
      TransactionAmount: "10",
      TransactionNarration: "STK PUSH TEST"
    };

    const response = await axios.post(STK_PUSH_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("STK PUSH RESPONSE:", response.data);
  } catch (error) {
    console.error("STK PUSH ERROR:", error.response?.data || error.message);
  }
}

sendSTKPush();
