import React, { useState, useEffect } from "react";

// Mobile Landing Page Component for Scanned QR Codes
function QRScanLandingPage({ qrCodeId, onBack }) {
  const [scanData, setScanData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (qrCodeId) {
      fetchScanData(qrCodeId);
    }
  }, [qrCodeId]);

  const fetchScanData = async (qrId) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://ecorewards-deploy.vercel.app/api/v1/qr/scan/${qrId}`
      );
      const result = await response.json();

      if (result.success) {
        setScanData(result.data);
      } else {
        setError("QR Code not found or invalid");
      }
    } catch (err) {
      setError("Error loading QR code data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reward details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!scanData) return null;

  const { qrCode, partner, reward, userInfo } = scanData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition duration-200"
          >
            ← Back
          </button>
          <div className="text-sm text-gray-600">
            Scanned: {qrCode.scanCount} times
          </div>
        </div>
      </div>

      <div className="p-6 pb-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to {partner.name}!
          </h1>
          <p className="text-gray-600 text-lg">
            You've discovered an eco-reward opportunity
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
            <h2 className="text-xl font-bold mb-2">{partner.name}</h2>
            <p className="text-green-100 capitalize mb-2">
              📍 {partner.category}
            </p>
            <p className="text-sm opacity-90">{partner.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">🎁 Available Reward</h3>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">
                  {reward.points} points
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-3">
              {reward.title}
            </h4>
            <p className="text-gray-600 mb-4">{reward.description}</p>

            {userInfo.isAuthenticated ? (
              <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition duration-200 text-lg">
                🎉 Claim {reward.points} Points Now!
              </button>
            ) : (
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition duration-200 text-lg">
                  🚀 Sign Up to Claim Reward
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl border-2 border-gray-200 transition duration-200">
                  🔑 Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// QR Code Display Component
function QRCodeDisplay({ qrData }) {
  if (!qrData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Generated QR Code</h3>
        <p className="text-gray-600 text-center py-8">
          Fill out the form and generate a QR code to see it here
        </p>
      </div>
    );
  }

  // Create QR code URL using a QR code API service
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    qrData.scanUrl
  )}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Generated QR Code</h3>

      <div className="text-center">
        {/* Success Message */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✅ QR Code Generated Successfully!
          </p>
          <p className="text-green-600 text-sm mt-1">QR ID: {qrData.qrCode}</p>
        </div>

        {/* QR Code Image */}
        <div className="mb-6">
          <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
            <img
              src={qrCodeImageUrl}
              alt="QR Code"
              className="w-64 h-64 mx-auto"
              onError={(e) => {
                e.target.src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(
                  qrData.scanUrl
                )}`;
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            📱 Scan this QR code with your phone
          </p>
        </div>

        {/* QR Details */}
        <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Location:</span>
              <span className="text-gray-600">{qrData.location.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Address:</span>
              <span className="text-gray-600">{qrData.location.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Partner:</span>
              <span className="text-gray-600">{qrData.partnerId.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Reward:</span>
              <span className="text-gray-600">{qrData.rewardId.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Points:</span>
              <span className="text-green-600 font-semibold">
                {qrData.rewardId.points} points
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Category:</span>
              <span className="text-gray-600 capitalize">
                {qrData.rewardId.category}
              </span>
            </div>
          </div>
        </div>

        {/* Scan URL */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Scan URL:</p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-2 bg-gray-100 rounded text-xs break-all text-left">
              {qrData.scanUrl}
            </div>
            <button
              onClick={() => copyToClipboard(qrData.scanUrl)}
              className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition duration-200"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Test Button */}
        <div className="mt-6 space-y-2">
          <a
            href={qrData.scanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 mr-2"
          >
            🔗 Test Scan URL
          </a>
          <button
            onClick={() => {
              // Extract QR ID from scan URL for testing
              const qrId = qrData.scanUrl.split("/").pop();
              window.showScanPage && window.showScanPage(qrId);
            }}
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            📱 Preview Mobile Page
          </button>
        </div>
      </div>
    </div>
  );
}

// QR Code Generator Component
function QRGenerator({ onQRGenerated }) {
  const [formData, setFormData] = useState({
    partnerId: "",
    rewardId: "",
    locationName: "",
    locationAddress: "",
    latitude: "",
    longitude: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const requestBody = {
        partnerId: formData.partnerId,
        rewardId: formData.rewardId,
        location: {
          name: formData.locationName,
          address: formData.locationAddress,
          coordinates: {
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
          },
        },
        notes: formData.notes,
      };

      const response = await fetch(
        "https://ecorewards-deploy.vercel.app/api/v1/qr/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Mzk3MzQ2Mzk2YjU5ODE1MjRhNTZmZiIsImlhdCI6MTc0ODcxMTQ5MSwiZXhwIjoxNzQ4Nzk3ODkxfQ.SHBvlXJ1vx31g7uxXYNb8dOG--6AIFQx1K4ZsZ3AOCQ",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (result.success) {
        onQRGenerated(result.data);
      } else {
        setError("Failed to generate QR code");
      }
    } catch (err) {
      setError("Error connecting to API: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Generate QR Code</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partner ID *
            </label>
            <input
              type="text"
              name="partnerId"
              value={formData.partnerId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="68383952fafd280fb0558548"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reward ID *
            </label>
            <input
              type="text"
              name="rewardId"
              value={formData.rewardId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="68383a80fafd280fb0558550"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location Name *
          </label>
          <input
            type="text"
            name="locationName"
            value={formData.locationName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Bokku - Maryland"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location Address *
          </label>
          <input
            type="text"
            name="locationAddress"
            value={formData.locationAddress}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1 Bush Street"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude *
            </label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="6.5244"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude *
            </label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3.3792"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="QR code for recycling program at main store location"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
        >
          {isLoading ? "Generating..." : "Generate QR Code"}
        </button>
      </form>
    </div>
  );
}

function App() {
  const [generatedQR, setGeneratedQR] = useState(null);
  const [currentView, setCurrentView] = useState("generator"); // 'generator' or 'scan'
  const [testQRId, setTestQRId] = useState("");

  // Check if URL contains scan route
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/scan/")) {
      const qrId = path.replace("/scan/", "");
      setTestQRId(qrId);
      setCurrentView("scan");
    }
  }, []);

  const handleQRGenerated = (qrData) => {
    setGeneratedQR(qrData);
  };

  const showScanPage = (qrId) => {
    setTestQRId(qrId);
    setCurrentView("scan");
    // Update URL without page reload
    window.history.pushState({}, "", `/scan/${qrId}`);
  };

  const backToGenerator = () => {
    setCurrentView("generator");
    setTestQRId("");
    // Update URL back to home
    window.history.pushState({}, "", "/");
  };

  // If viewing scan page, show the mobile landing page
  if (currentView === "scan") {
    return <QRScanLandingPage qrCodeId={testQRId} onBack={backToGenerator} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Make showScanPage available globally for the button */}
      {typeof window !== "undefined" && (window.showScanPage = showScanPage)}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              EcoRewards QR Generator
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Welcome to QR Code Generator
            </h2>
            <p className="text-lg text-gray-600">
              Generate QR codes for your eco-rewards program
            </p>
          </div>

          {/* Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QRGenerator onQRGenerated={handleQRGenerated} />
            <QRCodeDisplay qrData={generatedQR} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            EcoRewards QR Code System
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
