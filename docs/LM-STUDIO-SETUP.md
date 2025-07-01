# 🚀 LM Studio Setup Guide for Unified JS Pro Scripter

## 📋 Prerequisites
- ✅ LM Studio installed and running
- ✅ DeepSeek R1 model loaded (you have: **DeepSeek R1 0528 Qwen3 8B**)
- ✅ Windows 10/11 with sufficient GPU memory

---

## 🔧 Step-by-Step Setup

### **Step 1: Load Your Model**
1. Open LM Studio
2. Your **DeepSeek R1 0528 Qwen3 8B** should already be loaded ✅
3. If not loaded, go to "My Models" and load it

### **Step 2: Start Local Server** 🚨 **CRITICAL STEP**
1. In LM Studio, look for one of these tabs:
   - **"Local Server"** tab
   - **"Developer"** tab  
   - **"API Server"** tab
   - **"Chat"** tab with server options

2. **Start the server:**
   - Click **"Start Server"** button
   - OR toggle **"Local Server"** switch to ON
   - OR click **"Enable Local Server"**

3. **Verify server settings:**
   - **Port**: Should be `1234` (default)
   - **Host**: Should be `localhost` or `127.0.0.1`
   - **Model**: Should show your DeepSeek R1 model

4. **Confirm server is running:**
   - You should see: `Server running on http://localhost:1234`
   - OR: Green indicator showing server is active
   - OR: "Server Status: Running" message

### **Step 3: Test Server**
Open your browser and go to: `http://localhost:1234`

You should see:
- API documentation page
- OR: "LM Studio Local Server" welcome page
- OR: JSON response with server info

---

## 🔍 **Troubleshooting**

### **If you can't find the Server tab:**
1. **Update LM Studio** - Newer versions have better server support
2. **Check menus** - Look in File → Preferences → Server
3. **Try Chat tab** - Some versions have server controls in Chat

### **If server won't start:**
1. **Check port availability** - Another app might be using port 1234
2. **Firewall** - Allow LM Studio through Windows Firewall
3. **Antivirus** - Temporarily disable to test
4. **GPU Memory** - Close other apps using GPU

### **If model won't load:**
1. **GPU Memory** - Your model needs ~8GB GPU RAM
2. **Check model format** - Ensure it's compatible with LM Studio
3. **Try smaller model** - Test with a 3B model first

---

## ⚡ **Quick Test Commands**

Once server is running, test these in Command Prompt:

### **Test 1: Basic Connection**
```bash
curl http://localhost:1234/v1/models
```

### **Test 2: Simple Chat**
```bash
curl -X POST http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"deepseek-r1-0528-qwen3-8b\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}"
```

---

## 🎯 **Expected Results**

### **Working Server Shows:**
- ✅ `Server running on http://localhost:1234`
- ✅ Model loaded and ready
- ✅ API endpoints accessible
- ✅ Green/active status indicators

### **Our Test Should Show:**
```
🔬 LM Studio + DeepSeek R1 Connection Tests
════════════════════════════════════════════════════════════
🚀 Testing LM Studio connection...
📡 Connecting to: http://localhost:1234
🤖 Model: deepseek-r1-0528-qwen3-8b

🔍 Test 1: Basic WinCC code generation...
✅ LM Studio connection successful!
📝 Generated code:
──────────────────────────────────────────────────────────
// Generated WinCC JavaScript code here
──────────────────────────────────────────────────────────
```

---

## 📞 **Still Having Issues?**

1. **Screenshot** - Take a screenshot of your LM Studio interface
2. **Error messages** - Copy any error messages you see
3. **Version info** - Check LM Studio version (Help → About)

**Common Server Locations in LM Studio:**
- 📍 **Top navigation bar** - "Local Server" or "Developer"
- 📍 **Side panel** - Server controls in left/right panel
- 📍 **Chat interface** - Server toggle in chat settings
- 📍 **Settings menu** - Preferences → API/Server section

---

## 🚀 **Once Server is Running**

Run our test again:
```bash
node test-lm-studio.js
```

If successful, you'll see:
- ✅ Connection verified
- ✅ DeepSeek R1 responding
- ✅ WinCC code generation working
- 🎉 Ready for Phase 2: RAG implementation!

---

**Need help? The server setup is crucial for the AI scripter to work!** 