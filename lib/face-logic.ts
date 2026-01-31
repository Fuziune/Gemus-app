/**
 * GEMUS AI LOGIC ENGINE
 * Calculates Face Shape based on MediaPipe 468 Face Landmarks
 */

// 1. Helper: Calculate distance between two landmarks (Euclidean distance)
const getDistance = (p1: any, p2: any) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const analyzeFaceShape = (landmarks: any[]) => {
  if (!landmarks || landmarks.length === 0) return null;

  // --- KEY LANDMARK INDICES (Standard MediaPipe Mesh) ---
  // Vertical
  const topOfForehead = landmarks[10];
  const bottomOfChin = landmarks[152];

  // Horizontal (Widths)
  const leftCheekbone = landmarks[234];
  const rightCheekbone = landmarks[454];
  const leftJaw = landmarks[58]; // Angle of jaw
  const rightJaw = landmarks[288];
  const leftForehead = landmarks[103];
  const rightForehead = landmarks[332];

  // --- CALCULATE DIMENSIONS ---
  const faceLength = getDistance(topOfForehead, bottomOfChin);
  const cheekWidth = getDistance(leftCheekbone, rightCheekbone);
  const jawWidth = getDistance(leftJaw, rightJaw);
  const foreheadWidth = getDistance(leftForehead, rightForehead);

  // --- RATIOS & LOGIC ---
  // Does the face have sharp angles? (Jaw width is close to cheek width)
  const isJawProminent = jawWidth > cheekWidth * 0.9;
  
  // Is the face long? (Length is significantly bigger than width)
  const isLongFace = faceLength > cheekWidth * 1.5;

  let shape = "Oval"; // Default "Ideal" shape
  let recommendation = "";

  // --- CLASSIFICATION TREE ---
  
  if (isLongFace) {
    shape = "Oblong (Lung)";
    recommendation = "Cercei scurți, rotunzi sau tip 'Chandeliers' care adaugă lățime. Evită piesele lungi și subțiri.";
  } 
  else if (isJawProminent) {
    // If length and width are similar -> Square
    if (faceLength < cheekWidth * 1.2) {
      shape = "Square (Pătrat)";
      recommendation = "Cercei rotunzi, mari (Hoops) sau forme ovale pentru a îndulci unghiurile. Evită formele geometrice ascuțite.";
    } else {
      shape = "Rectangle (Dreptunghi)";
      recommendation = "Piese statement curbat, cercei lacrimă. Scopul este să scurtezi optic fața.";
    }
  } 
  else if (cheekWidth > foreheadWidth * 1.15 && cheekWidth > jawWidth * 1.15) {
    shape = "Diamond (Diamant)";
    recommendation = "Cercei care sunt mai lați la bază (forma de pară) pentru a echilibra pomeții proeminenți.";
  }
  else if (faceLength < cheekWidth * 1.15) {
    shape = "Round (Rotund)";
    recommendation = "Cercei lungi, geometrici sau rectangulari (Drop earrings). Scopul este alungirea feței.";
  }
  else {
    shape = "Oval";
    recommendation = "Ești norocoasă! Ți se potrivește aproape orice stil, în special cerceii tip șurub (Studs) sau triunghiulari.";
  }

  // --- SKIN TONE SAMPLING COORDINATES ---
  // Return the coordinates for the center of the cheek to sample color
  // Landmark 280 is a good flat spot on the right cheek
  const skinSamplePoint = {
    x: landmarks[280].x,
    y: landmarks[280].y
  };

  return {
    shape,
    recommendation,
    metrics: { faceLength, cheekWidth, jawWidth },
    skinSamplePoint
  };
};