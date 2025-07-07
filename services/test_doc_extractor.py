#!/usr/bin/env python3
"""Basic test script for the document extractor service."""

import requests
import json
import os
from pathlib import Path

# Service endpoint
BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test the health check endpoint."""
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.RequestException as e:
        print(f"❌ Cannot connect to service: {e}")
        return False

def test_extract_endpoint():
    """Test the extract endpoint with a sample file."""
    # Create a sample test file
    test_file_content = b"Sample PDF content for testing"
    
    files = {
        'file': ('test.pdf', test_file_content, 'application/pdf')
    }
    
    data = {
        'file_id': 'test_file_001',
        'submission_id': '550e8400-e29b-41d4-a716-446655440000'
    }
    
    try:
        response = requests.post(f"{BASE_URL}/extract", files=files, data=data)
        print(f"Extract endpoint response: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Extract test completed: {json.dumps(result, indent=2)}")
            return True
        else:
            print(f"❌ Extract test failed: {response.text}")
            return False
    except requests.RequestException as e:
        print(f"❌ Extract test error: {e}")
        return False

def check_environment():
    """Check if required environment variables are set."""
    required_vars = ['OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.environ.get(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"⚠️  Missing environment variables: {', '.join(missing_vars)}")
        print("   Set these variables before running the service.")
        return False
    else:
        print("✅ All required environment variables are set")
        return True

def main():
    """Run basic tests for the document extractor service."""
    print("🧪 Testing Document Extractor Service\n")
    
    # Check environment
    env_ok = check_environment()
    
    # Test health endpoint
    health_ok = test_health_endpoint()
    
    if health_ok:
        # Test extract endpoint (only if health check passes)
        extract_ok = test_extract_endpoint()
    else:
        extract_ok = False
        print("⏭️  Skipping extract test (service not running)")
    
    # Summary
    print("\n📊 Test Summary:")
    print(f"   Environment: {'✅' if env_ok else '❌'}")
    print(f"   Health Check: {'✅' if health_ok else '❌'}")
    print(f"   Extract Test: {'✅' if extract_ok else '❌'}")
    
    if all([env_ok, health_ok, extract_ok]):
        print("\n🎉 All tests passed!")
        return 0
    else:
        print("\n⚠️  Some tests failed. Check the service configuration.")
        return 1

if __name__ == "__main__":
    exit(main())
