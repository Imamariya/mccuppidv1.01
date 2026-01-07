
export const trackLandingClick = async (): Promise<{ success: boolean }> => {
  const payload = {
    source: "landing",
    device: window.innerWidth < 768 ? "mobile" : "tablet",
    timestamp: new Date().toISOString()
  };

  console.log("MOCK API CALL: POST /api/track/landing-click", payload);

  // Simulate network latency
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 800);
  });
};
