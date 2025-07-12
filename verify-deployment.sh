#!/bin/bash

# BitBash Project - Vercel Deployment Verification Script

echo "🔍 Verifying Vercel Deployment Configuration..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

success_count=0
total_checks=0

check_file() {
    local file=$1
    local description=$2
    total_checks=$((total_checks + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $description${NC}"
        success_count=$((success_count + 1))
        return 0
    else
        echo -e "${RED}❌ $description${NC}"
        return 1
    fi
}

check_directory() {
    local dir=$1
    local description=$2
    total_checks=$((total_checks + 1))
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $description${NC}"
        success_count=$((success_count + 1))
        return 0
    else
        echo -e "${RED}❌ $description${NC}"
        return 1
    fi
}

check_command() {
    local cmd=$1
    local description=$2
    total_checks=$((total_checks + 1))
    
    if command -v "$cmd" &> /dev/null; then
        echo -e "${GREEN}✅ $description${NC}"
        success_count=$((success_count + 1))
        return 0
    else
        echo -e "${RED}❌ $description${NC}"
        return 1
    fi
}

echo -e "${BLUE}📋 Checking Deployment Configuration Files...${NC}"
check_file "vercel.json" "Vercel configuration file exists"
check_file "api/index.py" "Serverless API entry point exists"
check_file "api/requirements.txt" "API Python dependencies file exists"
check_file "DEPLOYMENT.md" "Deployment documentation exists"
check_file "deploy.sh" "Deployment script exists"
check_file "environment.config.example" "Environment variables template exists"

echo -e "\n${BLUE}📁 Checking Project Structure...${NC}"
check_directory "Frontend/my-react-app" "Frontend React app directory exists"
check_directory "Backend" "Backend Flask app directory exists"
check_directory "Backend/api" "Backend API directory exists"

echo -e "\n${BLUE}📦 Checking Frontend Dependencies...${NC}"
check_file "Frontend/my-react-app/package.json" "Frontend package.json exists"
check_file "Frontend/my-react-app/src/App.jsx" "Frontend main app file exists"
check_file "Frontend/my-react-app/src/api.js" "Frontend API service file exists"

echo -e "\n${BLUE}🐍 Checking Backend Dependencies...${NC}"
check_file "Backend/requirements.txt" "Backend requirements.txt exists"
check_file "Backend/run.py" "Backend Flask app factory exists"
check_file "Backend/api/models.py" "Backend database models exist"
check_file "Backend/api/routes.py" "Backend API routes exist"

echo -e "\n${BLUE}🛠️ Checking Required Tools...${NC}"
check_command "node" "Node.js is installed"
check_command "npm" "npm is installed"
check_command "python3" "Python 3 is installed"

echo -e "\n${BLUE}📊 Checking Configuration Content...${NC}"
total_checks=$((total_checks + 1))
if grep -q "VITE_API_BASE" vercel.json; then
    echo -e "${GREEN}✅ Frontend API base URL is configured${NC}"
    success_count=$((success_count + 1))
else
    echo -e "${RED}❌ Frontend API base URL is not configured${NC}"
fi

total_checks=$((total_checks + 1))
if grep -q "@vercel/python" vercel.json; then
    echo -e "${GREEN}✅ Python runtime is configured${NC}"
    success_count=$((success_count + 1))
else
    echo -e "${RED}❌ Python runtime is not configured${NC}"
fi

total_checks=$((total_checks + 1))
if grep -q "Flask" api/requirements.txt; then
    echo -e "${GREEN}✅ Flask is included in API dependencies${NC}"
    success_count=$((success_count + 1))
else
    echo -e "${RED}❌ Flask is not included in API dependencies${NC}"
fi

# Summary
echo -e "\n${BLUE}📈 Verification Summary${NC}"
echo -e "Passed: ${GREEN}$success_count${NC}/$total_checks checks"

if [ $success_count -eq $total_checks ]; then
    echo -e "\n${GREEN}🎉 All checks passed! Your project is ready for Vercel deployment.${NC}"
    echo -e "\n${YELLOW}Next steps:${NC}"
    echo -e "1. Set up environment variables in Vercel dashboard"
    echo -e "2. Run: ${BLUE}./deploy.sh${NC}"
    echo -e "3. Follow instructions in DEPLOYMENT.md"
    echo -e "\n${BLUE}Quick deploy:${NC} vercel --prod"
    exit 0
else
    echo -e "\n${RED}⚠️ Some checks failed. Please fix the issues above before deploying.${NC}"
    exit 1
fi 