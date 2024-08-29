import * as THREE from 'three'; 
import gsap from 'gsap';

function CloneMeshMaterials(mesh) 
{
    mesh.traverse((child) => 
    {
        if (child.isMesh) {
            let material = child.material;

            // If the material is an array (multiple materials), clone each material in the array
            if (Array.isArray(material))
            {
                material = material.map(mat => mat.clone());
            } 
            else if (material instanceof THREE.Material) 
            {
                material = material.clone();
            }

            // Assign the cloned material back to the mesh
            child.material = material;
        }
    });
}

function AddClippingPlaneToMaterials(mesh, clippingPlane) 
{
    mesh.traverse((child) => 
    {
        if (child.isMesh) 
        {
            let material = child.material;

            if (Array.isArray(material)) 
            {
                material.forEach(mat => {
                    if (mat instanceof THREE.Material) {
                        mat.clippingPlanes = mat.clippingPlanes || [];
                        mat.clippingPlanes.push(clippingPlane);
                        mat.clipShadows = true;
                    }
                });
            } 
            else if (material instanceof THREE.Material) 
            {
                material.clippingPlanes = material.clippingPlanes || [];
                material.clippingPlanes.push(clippingPlane);
                material.clipShadows = true;
            }
        }
    });
}

function CreateGradientTexture(metadata, context, canvas) 
{
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, metadata.gradientStart); // Start color
    gradient.addColorStop(1, metadata.gradientEnd); // End color
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    return new THREE.CanvasTexture(canvas);
}

function FetchCurrentGradientColors(context, canvas) 
{
    const gradientStart = context.getImageData(0, 0, 1, 1).data; // Top-left corner color
    const gradientEnd = context.getImageData(canvas.width - 1, canvas.height - 1, 1, 1).data; // Bottom-right corner color
    
    const hex = (r, g, b) => `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;

    return {
        start: hex(gradientStart[0], gradientStart[1], gradientStart[2]),
        end: hex(gradientEnd[0], gradientEnd[1], gradientEnd[2])
    };
}

function CreateShadowPlane(yPosition) 
{
    const planeGeometry = new THREE.PlaneGeometry(100, 100); // Ensure the plane is large enough
    const planeMaterial = new THREE.ShadowMaterial({opacity: 0.8}); // Invisible but receives shadows
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -Math.PI / 2; 
    plane.position.y = yPosition
    plane.receiveShadow = true; 

    return plane; 
}

function CreateCarouselDots(projectCount, currentProjectIndex) 
{
    const carouselDots = document.getElementById('carousel-dots');
    carouselDots.innerHTML = ''; // Clear existing dots

    for (let i = 0; i < projectCount; i++) 
    {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (i === currentProjectIndex) 
        {
            dot.classList.add('active'); // Highlight the current project
        }
        carouselDots.appendChild(dot);
    }
}

function UpdateCarouselDots(currentProjectIndex) 
{
    const dots = document.querySelectorAll('#carousel-dots .dot'); // Select all existing dots

    dots.forEach((dot, index) => {
        dot.classList.remove('active'); // Remove active class from all dots
        if (index === currentProjectIndex) 
        {
            dot.classList.add('active'); // Add active class to the current dot
        }
    });
}

function GenericProjectData() 
{
    const projectData = 
    {
        title: "Project Title", 
        tagline: "Project Tagline", 
        sections: [
            {
                type: "text-image",
                content: {
                    paragraph: "This is a paragraph.", 
                    image: {
                        src: "media/placeholder-image.jpg", 
                        alt: "project image", 
                        position: "left"
                    }
                }
            },
            {
                type: "text-image",
                content: {
                    paragraph: "This is a paragraph.", 
                    image: {
                        src: "media/placeholder-image.jpg", 
                        alt: "project image", 
                        position: "right"
                    }
                }
            },
            {
                type: "video",
                content: {
                    videoId: "dQw4w9WgXcQ", // YouTube video ID
                    caption: "This is a caption for the video."
                }
            }
        ],
        download: {
            url: "download-link.zip", 
            label: "Download Project"
        }
    }    
    
    return projectData;
}

function AnimateVoxels(objectPortfolio, offset) 
{
    const timeline = gsap.timeline({
        onComplete: () => { 
            objectPortfolio.voxelStartAnimationOver = true; 
        }
    });
    const voxelizedMesh = objectPortfolio.voxelizedMesh; 
    const voxelCount = voxelizedMesh.count;

    voxelizedMesh.position.y += offset; 
 
    for (let i = 0; i < voxelCount; i++) 
    {
        let matrix = new THREE.Matrix4; 
        let position = new THREE.Vector3; 
        let originalPosition = new THREE.Vector3; 

        voxelizedMesh.getMatrixAt(i, matrix); 
        position.setFromMatrixPosition(matrix);
        originalPosition.setFromMatrixPosition(matrix); 

        originalPosition.y -= offset; 

        timeline.to(position, {
            y: originalPosition.y,
            duration: 0.5,
            ease: "expo.inOut",
            onUpdate: () => {
                matrix.setPosition(position);
                voxelizedMesh.setMatrixAt(i, matrix);   
                voxelizedMesh.needsUpdate = true; 
            },
            onComplete: () => {
                matrix.setPosition(position); 
                voxelizedMesh.setMatrixAt(i, matrix); 
                voxelizedMesh.instanceMatrix.needsUpdate = true; 
                voxelizedMesh.needsUpdate = true; 
            }
        }, (i / 256) * 0.1);
    }
}

export default {AnimateVoxels, CloneMeshMaterials, AddClippingPlaneToMaterials, CreateGradientTexture, FetchCurrentGradientColors, CreateShadowPlane, CreateCarouselDots, UpdateCarouselDots, GenericProjectData}; 