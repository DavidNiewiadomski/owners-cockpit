
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { RotateCcw, Eye, EyeOff } from 'lucide-react';

interface BIMFile {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
}

interface BIMViewerProps {
  projectId: string;
  bimFile: BIMFile;
  onElementSelect: (element: unknown) => void;
}

const BIMViewer: React.FC<BIMViewerProps> = ({ projectId: _projectId, bimFile, onElementSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const modelRef = useRef<THREE.Object3D | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWireframe, setShowWireframe] = useState(false);

  const initViewer = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(10, 10, 10);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Grid
    const gridHelper = new THREE.GridHelper(50, 50);
    scene.add(gridHelper);

    // Mouse events
    renderer.domElement.addEventListener('click', onMouseClick);
    window.addEventListener('resize', onWindowResize);

    // Animation loop
    animate();
  }, [animate, onMouseClick]);

  const animate = useCallback(() => {
    requestAnimationFrame(animate);
    
    if (controlsRef.current) {
      controlsRef.current.update();
    }
    
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  const loadModel = useCallback(async () => {
    if (!sceneRef.current || !bimFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.storage
        .from('bim_models')
        .download(bimFile.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      let model: THREE.Object3D;

      if (bimFile.file_type === 'ifc') {
        const loader = new IFCLoader();
        // Use load method with callback instead of loadAsync
        model = await new Promise((resolve, reject) => {
          loader.load(
            url,
            (loadedModel) => resolve(loadedModel),
            undefined,
            (error) => reject(error)
          );
        });
      } else {
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
          loader.load(
            url,
            (loadedGltf) => resolve(loadedGltf),
            undefined,
            (error) => reject(error)
          );
        });
        model = (gltf as { scene: THREE.Object3D }).scene;
      }

      // Clear existing model
      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current);
      }

      modelRef.current = model;
      sceneRef.current.add(model);

      // Center the model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      model.position.sub(center);
      
      // Adjust camera position
      const maxDim = Math.max(size.x, size.y, size.z);
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.set(maxDim, maxDim, maxDim);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }

      URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load BIM model:', err);
      setError('Failed to load 3D model');
      setIsLoading(false);
    }
  }, [bimFile]);

  const onMouseClick = useCallback((event: MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      const elementData = {
        id: object.uuid,
        name: object.name || 'Unnamed Element',
        type: object.type,
        position: object.position,
        userData: object.userData,
        geometry: object.geometry,
        material: object.material
      };

      onElementSelect(elementData);

      // Highlight selected element
      highlightElement(object);
    }
  }, [onElementSelect]);

  const highlightElement = (object: THREE.Object3D) => {
    // Remove previous highlights
    sceneRef.current?.children.forEach(child => {
      if (child.userData.isHighlight) {
        sceneRef.current?.remove(child);
      }
    });

    if (object instanceof THREE.Mesh) {
      const geometry = object.geometry.clone();
      const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
        transparent: true,
        opacity: 0.5
      });

      const highlight = new THREE.Mesh(geometry, material);
      highlight.position.copy(object.position);
      highlight.rotation.copy(object.rotation);
      highlight.scale.copy(object.scale);
      highlight.userData.isHighlight = true;

      sceneRef.current?.add(highlight);
    }
  };


  const onWindowResize = () => {
    if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  };

  const cleanup = useCallback(() => {
    if (rendererRef.current) {
      rendererRef.current.domElement.removeEventListener('click', onMouseClick);
      if (containerRef.current?.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
    }
    window.removeEventListener('resize', onWindowResize);
  }, [onMouseClick]);

  useEffect(() => {
    if (!containerRef.current || !bimFile) return;

    initViewer();
    loadModel();

    return () => {
      cleanup();
    };
  }, [bimFile, initViewer, loadModel, cleanup]);

  const resetView = () => {
    if (!cameraRef.current || !controlsRef.current || !modelRef.current) return;

    const box = new THREE.Box3().setFromObject(modelRef.current);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    cameraRef.current.position.set(maxDim, maxDim, maxDim);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const toggleWireframe = () => {
    if (!modelRef.current) return;

    setShowWireframe(!showWireframe);
    
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            if (mat instanceof THREE.Material) {
              mat.wireframe = !showWireframe;
            }
          });
        } else if (child.material instanceof THREE.Material) {
          child.material.wireframe = !showWireframe;
        }
      }
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading 3D model</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading 3D model...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={resetView}
          className="bg-white shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleWireframe}
          className="bg-white shadow-md"
        >
          {showWireframe ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Info */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm">
        <p className="font-medium">{bimFile.filename}</p>
        <p className="text-muted-foreground text-xs">Click elements for details</p>
      </div>
    </div>
  );
};

export default BIMViewer;
