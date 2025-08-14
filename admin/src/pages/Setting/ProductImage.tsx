// import React, { useState, useEffect, useRef } from "react";
// import { FaEdit } from "react-icons/fa";
// import { FaEye, FaMapPin, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
// import { FiUpload } from "react-icons/fi";

// import { getProducts } from "../../services/productService";
// import type { IProduct } from "../../types/Product";
// import Image from "../../components/Images/Image";
// import Button from "../../components/Buttons/Button";
// import LoadingSpinner from "../../components/LoadingSpinner";
// import { formatDate } from "../../utils/formData";
// import { MdBlock } from "react-icons/md";
// import { createProductImage, deleteProductImages, getAllProductImages, updateProductImage } from "../../services/productImageService";

// // Types matching your Mongoose schema
// interface IHotspot {
//   positionX: number;
//   positionY: number;
//   product: IProduct;
// }

// interface IProductImage {
//   _id?: string;
//   image: string;
//   hotspots: IHotspot[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// // Product Selection Modal
// const ProductSelectionModal: React.FC<{
//   position: { x: number; y: number };
//   onSave: (product: IProduct) => void;
//   onCancel: () => void;
// }> = ({ position, onSave, onCancel }) => {
//   const [products, setProducts] = useState<IProduct[]>([]);
//   const [product, setProduct] = useState<IProduct | null>(null);
//   const [name, setName] = useState("");
//   const handleSave = () => {
//     if (product) {
//       onSave(product);
//     }
//   };
//   const fetchProductByName = async () => {
//     try {
//       const {
//         data: { products },
//       } = await getProducts({ name });
//       setProducts(products);
//     } catch (error) {}
//   };

//   useEffect(() => {
//     fetchProductByName();
//   }, [name]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-warm-gray rounded-lg p-6 w-96">
//         <h3 className="text-lg font-semibold mb-4">Add Hotspot</h3>
//         <p className="text-sm text-gray-600 mb-4">
//           Position: {position.x.toFixed(1)}%, {position.y.toFixed(1)}%
//         </p>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Product Name
//           </label>
//           <input
//             type="text"
//             value={product?.name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter product name..."
//             autoFocus
//           />
//         </div>
//         <div className="h-[400px] overflow-y-auto">
//           {products.map((prod) => (
//             <div
//               onClick={() => setProduct(prod)}
//               className="flex"
//               key={prod._id}
//             >
//               <Image
//                 src={prod.images[0]}
//                 alt={prod.name}
//                 fromServer
//                 styles="w-20 h-20 object-cover"
//               />{" "}
//               <p> {prod.name} </p>
//             </div>
//           ))}
//         </div>
//         <div className="flex space-x-3">
//           <button
//             onClick={handleSave}
//             disabled={!product}
//             className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Add Hotspot
//           </button>
//           <button
//             onClick={onCancel}
//             className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Interactive Image Editor
// const ImageEditor: React.FC<{
//   imageUrl: string;
//   hotspots: IHotspot[];
//   onHotspotAdd: (hotspot: IHotspot) => void;
//   onHotspotEdit: (index: number) => void;
//   onHotspotDelete: (index: number) => void;
//   isEditable?: boolean;
// }> = ({
//   imageUrl,
//   hotspots,
//   onHotspotAdd,
//   onHotspotEdit,
//   onHotspotDelete,
//   isEditable = false,
// }) => {
//   const imageRef = useRef<HTMLImageElement>(null);
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [pendingPosition, setPendingPosition] = useState<{
//     x: number;
//     y: number;
//   } | null>(null);

//   const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
//     if (!isEditable) return;

//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = ((e.clientX - rect.left) / rect.width) * 100;
//     const y = ((e.clientY - rect.top) / rect.height) * 100;

//     setPendingPosition({ x, y });
//     setShowProductModal(true);
//   };

//   const handleAddHotspot = (product: IProduct) => {
//     if (pendingPosition) {
//       onHotspotAdd({
//         positionX: pendingPosition.x,
//         positionY: pendingPosition.y,
//         product,
//       });
//     }
//     setShowProductModal(false);
//     setPendingPosition(null);
//   };

//   const handleHotspotClick = (e: React.MouseEvent, index: number) => {
//     e.stopPropagation();
//     if (isEditable) {
//       onHotspotEdit(index);
//     }
//   };

//   return (
//     <div className="relative inline-block h-full">
//       <img
//         ref={imageRef}
//         src={imageUrl}
//         alt="Product"
//         className={`max-w-full h-auto rounded-sm ${
//           isEditable ? "cursor-crosshair" : ""
//         }`}
//         style={{ maxHeight: "500px" }}
//         onClick={handleImageClick}
//         onError={(e) => {
//           e.currentTarget.src =
//             "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE5NVYxNDVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCA5MEgyNTBWMjEwSDE1MFY5MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==";
//         }}
//       />

//       {/* Hotspot Markers */}
//       {hotspots.map((hotspot, index) => (
//         <button
//           key={index}
//           onClick={(e) => handleHotspotClick(e, index)}
//           className="absolute w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg hover:bg-red-600 transition-all transform hover:scale-110 flex items-center justify-center group"
//           style={{
//             left: `${hotspot.positionX}%`,
//             top: `${hotspot.positionY}%`,
//             transform: "translate(-50%, -50%)",
//           }}
//           title={hotspot.product._id}
//         >
//           <FaMapPin className="w-4 h-4 text-white" />

//           <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//             <span>{hotspot.product.name} </span>
//             {isEditable && (
//               <>
//                 <br />
//                 <span className="text-gray-300">Click to edit</span>
//               </>
//             )}
//           </div>
//         </button>
//       ))}

//       {/* Click instruction */}
//       {isEditable && hotspots.length === 0 && (
//         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//           <div className="bg-black/80 bg-opacity-50 text-white px-4 py-2 rounded-lg">
//             Click on the image to add hotspots
//           </div>
//         </div>
//       )}

//       {/* Product Selection Modal */}
//       {showProductModal && pendingPosition && (
//         <ProductSelectionModal
//           position={pendingPosition}
//           onSave={handleAddHotspot}
//           onCancel={() => {
//             setShowProductModal(false);
//             setPendingPosition(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// // Edit Hotspot Modal
// const EditHotspotModal: React.FC<{
//   hotspot: IHotspot;
//   onSave: (updatedHotspot: IHotspot) => void;
//   onDelete: () => void;
//   onCancel: () => void;
// }> = ({ hotspot, onSave, onDelete, onCancel }) => {
//   const [product, setProduct] = useState(hotspot.product);
//   const [products, setProducts] = useState<IProduct[]>([]);
//   const [name, setName] = useState("");

//   const handleSave = () => {
//     if (product) {
//       onSave({ ...hotspot, product });
//     }
//   };

//   const fetchProductByName = async () => {
//     try {
//       const {
//         data: { products },
//       } = await getProducts({ name });
//       setProducts(products);
//     } catch (error) {}
//   };

//   useEffect(() => {
//     fetchProductByName();
//   }, [name]);

//   return (
//     <div className="fixed inset-0 bg-warm-gray/90 bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-off-black rounded-sm p-3 w-xl">
//         <h3 className="text-lg font-semibold mb-2">Edit Hotspot</h3>
//         <p className="text-xs text-cold-gray/90 mb-4">
//           Position: {hotspot.positionX.toFixed(1)}%,{" "}
//           {hotspot.positionY.toFixed(1)}%
//         </p>
//         <div className="mb-4">
//           <label className="capitalize text-sm mb-2">Product Name</label>
//           <input
//             type="text"
//             value={name}
//             placeholder="Search By Name"
//             onChange={(e) => setName(e.target.value)}
//             className={`w-full text-off-white bg-off-black border border-cold-gray/70 focus:border-cold-gray shadow-xs focus:shadow-lg shadow-off-white/10 px-3 py-2.5 duration-200 rounded-sm placeholder:text-cold-gray/70`}
//             autoFocus
//             onKeyDown={(e) => e.key === "Enter" && handleSave()}
//           />
//         </div>
//         <div className="h-[400px] overflow-y-auto bg-warm-gray p-2 flex flex-col gap-2 mb-4">
//           {products.length === 0 && (
//             <div className="flex items-center justify-center h-full">
//               <MdBlock className="text-2xl mr-2" /> No Product Match This Name
//             </div>
//           )}
//           {products.map((prod) => (
//             <div
//               onClick={() => setProduct(prod)}
//               className="flex bg-off-black hover:bg-off-black/70 cursor-pointer rounded-sm p-2 gap-2"
//               key={prod._id}
//             >
//               <Image
//                 src={prod.images[0]}
//                 alt={prod.name}
//                 fromServer
//                 styles="w-16 h-16 object-cover rounded-sm"
//               />{" "}
//               <div>
//                 <p> {prod.name} </p>
//                 <p className="text-cold-gray/80 text-sm"> {prod.price} DA </p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="flex space-x-2">
//           <Button
//             styles="flex-1"
//             action={onCancel}
//             content="Cancel"
//             variant="secondary"
//           />
//           <Button
//             styles="flex-1"
//             action={onDelete}
//             content="Delete"
//             variant="delete"
//           />
//           <Button
//             styles="flex-1"
//             action={handleSave}
//             disabled={!product}
//             content="Save"
//             variant="cta"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// // File Upload Component
// const ImageUploader: React.FC<{
//   onImageSelect: (imageUrl: string) => void;
// }> = ({ onImageSelect }) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const imageUrl = event.target?.result as string;
//         onImageSelect(imageUrl);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div>
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         className="hidden"
//       />
//       <button
//         onClick={() => fileInputRef.current?.click()}
//         className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
//       >
//         <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <p className="text-gray-600">Click to upload an image</p>
//         <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
//       </button>
//     </div>
//   );
// };

// // Main Component
// const ProductImageManager: React.FC = () => {
//   const [productImages, setProductImages] = useState<IProductImage[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [editingItem, setEditingItem] = useState<IProductImage | null>(null);
//   const [viewingItem, setViewingItem] = useState<IProductImage | null>(null);
//   const [editingHotspot, setEditingHotspot] = useState<{
//     hotspot: IHotspot;
//     index: number;
//   } | null>(null);

//   // Form state
//   const [formData, setFormData] = useState<{
//     image: File | null;
//     hotspots: IHotspot[];
//   }>({
//     image: null,
//     hotspots: [],
//   });

//   // Load data
//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const {data : {productImages}} = await getAllProductImages();
//       setProductImages(productImages);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     }
//     setLoading(false);
//   };

//   const handleCreate = async () => {
//     if (!formData.image) return;
//     const formDataToSend = new FormData()
//     if(formData.hotspots) formDataToSend.append("hotspots" , JSON.stringify(formData.hotspots))
//     if(formData.image) formDataToSend.append("image" ,formData.image)

//     setLoading(true);
//     try {
//       const {data : {productImage}} = await createProductImage(formDataToSend);
//       setProductImages([...productImages , productImage ])
//       resetForm();
//     } catch (error) {
//       console.error("Error creating item:", error);
//     }
//     setLoading(false);
//   };

//   const handleUpdate = async () => {
//     if (!editingItem?._id || !formData.image) return;
//     const formDataToSend = new FormData()
//     if(formData.image) formDataToSend.append("image" , formData.image)
//     if(formData.hotspots) formDataToSend.append("image" , JSON.stringify(formData.hotspots))

//     setLoading(true);
//     try {
//       await updateProductImage(editingItem._id, formDataToSend);
//       await loadData();
//       resetForm();
//     } catch (error) {
//       console.error("Error updating item:", error);
//     }
//     setLoading(false);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this item?")) return;

//     setLoading(true);
//     try {
//       await deleteProductImages(id)
//       await loadData();
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//     setLoading(false);
//   };

//   const resetForm = () => {
//     setFormData({ image: null, hotspots: [] });
//     setShowForm(false);
//     setEditingItem(null);
//     setEditingHotspot(null);
//   };

//   const startEdit = (item: IProductImage) => {
//     setEditingItem(item);
//     setFormData({
//       image: item.image,
//       hotspots: [...item.hotspots],
//     });
//     setShowForm(true);
//   };

//   const handleImageSelect = (imageUrl: string) => {
//     setFormData({ ...formData, image: imageUrl });
//   };

//   const handleHotspotAdd = (hotspot: IHotspot) => {
//     setFormData({
//       ...formData,
//       hotspots: [...formData.hotspots, hotspot],
//     });
//   };

//   const handleHotspotEdit = (index: number) => {
//     setEditingHotspot({
//       hotspot: formData.hotspots[index],
//       index,
//     });
//   };

//   const handleHotspotSave = (updatedHotspot: IHotspot) => {
//     if (editingHotspot) {
//       const newHotspots = [...formData.hotspots];
//       newHotspots[editingHotspot.index] = updatedHotspot;
//       setFormData({ ...formData, hotspots: newHotspots });
//       setEditingHotspot(null);
//     }
//   };

//   const handleHotspotDelete = () => {
//     if (editingHotspot) {
//       const newHotspots = formData.hotspots.filter(
//         (_, i) => i !== editingHotspot.index
//       );
//       setFormData({ ...formData, hotspots: newHotspots });
//       setEditingHotspot(null);
//     }
//   };

//   return (
//     <div className=" h-full w-full flex flex-col gap-3">
//       <div className="mb-3 flex items-center justify-between bg-off-black p-3">
//         <div>
//           <h1 className="text-xl font-bold mb-0.5">Product Image Management</h1>
//           <p className="text-cold-gray/70 text-sm">
//             Upload images and click to add interactive hotspots
//           </p>
//         </div>
//         <Button
//           content={
//             <>
//               <FaPlus className="w-5 h-5" />
//               <span>Add New Image</span>
//             </>
//           }
//           action={() => setShowForm(true)}
//         />
//       </div>

//       {/* Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-warm-gray/90 bg-opacity-50 flex items-center justify-center p-4 z-40">
//           <div className="bg-off-black rounded-lg p-3 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-3">
//               {editingItem ? "Edit Product Image" : "Add New Product Image"}
//             </h2>

//             <div className="flex items-start gap-5">
//               {/* Image Upload/Display */}
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">Image</h3>
//                 {!formData.image ? (
//                   <ImageUploader onImageSelect={handleImageSelect} />
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="text-center relative">
//                       <ImageEditor
//                         imageUrl={formData.image}
//                         hotspots={formData.hotspots}
//                         onHotspotAdd={handleHotspotAdd}
//                         onHotspotEdit={handleHotspotEdit}
//                         onHotspotDelete={handleHotspotDelete}
//                         isEditable={true}
//                       />
//                       <Button
//                         action={() => setFormData({ ...formData, image: "" })}
//                         content="Change Image"
//                         variant="warning"
//                         styles="top-1.5 right-1.5 absolute mr-0 ml-auto"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="flex-1">
//                 {/* Hotspots List */}
//                 {formData.hotspots.length > 0 && (
//                   <>
//                     <h3 className="text-lg font-semibold mb-3">
//                       Hotspots ({formData.hotspots.length})
//                     </h3>
//                     <div className="grid gap-3">
//                       {formData.hotspots.map((hotspot, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between p-2 bg-warm-gray mb-2 rounded-sm"
//                         >
//                           <div className="flex gap-2">
//                             <Image
//                               fromServer
//                               src={hotspot.product.images[0]}
//                               alt={hotspot.product.name}
//                               styles="w-16 h-16 object-cover rounded-sm"
//                             />
//                             <div>
//                               <p className="text-lg"> {hotspot.product.name}</p>
//                               <p className="text-sm text-cold-gray/80">
//                                 {" "}
//                                 Position: {hotspot.positionX.toFixed(1)}%,{" "}
//                                 {hotspot.positionY.toFixed(1)}%
//                               </p>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => handleHotspotEdit(index)}
//                             className="p-2 text-primary flex justify-center items-center cursor-pointer hover:bg-blue-50 rounded"
//                           >
//                             <FaEdit className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}

//                 {/* Form Actions */}
//                 <div className="flex justify-end space-x-4 pt-4 border-t">
//                   <Button
//                     action={resetForm}
//                     disabled={loading}
//                     content="Cancel"
//                     variant="secondary"
//                   />
//                   <Button
//                     action={editingItem ? handleUpdate : handleCreate}
//                     disabled={loading || !formData.image}
//                     content={editingItem ? "Update" : "Create"}
//                     variant="info"
//                     loading={loading}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Hotspot Modal */}
//       {editingHotspot && (
//         <EditHotspotModal
//           hotspot={editingHotspot.hotspot}
//           onSave={handleHotspotSave}
//           onDelete={handleHotspotDelete}
//           onCancel={() => setEditingHotspot(null)}
//         />
//       )}

//       {/* View Modal */}
//       {viewingItem && (
//         <div className="fixed inset-0 bg-warm-gray/90 bg-opacity-50 flex items-center justify-center p-3 z-40">
//           <div className="bg-off-black rounded-sm p-4 pt-2 max-w-4xl w-full max-h-[90vh] flex flex-col">
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="text-xl font-bold">View Product Image</h2>
//               <button
//                 onClick={() => setViewingItem(null)}
//                 className=" text-cold-gray/70  hover:text-off-white cursor-pointer duration-200"
//               >
//                 <FaXmark className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="text-center flex-1 flex items-start gap-5">
//               <ImageEditor
//                 imageUrl={viewingItem.image}
//                 hotspots={viewingItem.hotspots}
//                 onHotspotAdd={() => {}}
//                 onHotspotEdit={() => {}}
//                 onHotspotDelete={() => {}}
//                 isEditable={false}
//               />

//               {viewingItem.hotspots.length > 0 && (
//                 <div className="flex-1 h-full flex flex-col min-h-0">
//                   <h3 className="text-lg font-semibold mb-2 text-left">
//                     Hotspots:
//                   </h3>
//                   <div className="overflow-y-auto flex-1 min-h-0">
//                     {viewingItem.hotspots.map((hotspot, index) => (
//                       <div
//                         key={index}
//                         className="p-3 bg-warm-gray rounded-sm mb-2 flex gap-3"
//                       >
//                         <div className="w-16 h-16 rounded-sm overflow-hidden">
//                           <Image
//                             src={hotspot.product.images[0]}
//                             alt={hotspot.product.name}
//                             fromServer
//                           />
//                         </div>
//                         <div className="">
//                           <p className="text-left text-lg">
//                             {hotspot.product.name}
//                           </p>
//                           <p className="text-cold-gray/80 text-sm font-medium">
//                             Position: {hotspot.positionX.toFixed(1)}%,{" "}
//                             {hotspot.positionY.toFixed(1)}%
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Data Table */}
//       <div className="bg-off-black flex-1 p-3  overflow-hidden flex flex-col">
//         <div className="grid grid-cols-4 pb-3 text-xs text-cold-gray/70 uppercase">
//           <div className=" col-span-1">Image</div>
//           <div className=" col-span-1 text-center">Hotspots</div>
//           <div className=" col-span-1 text-center">Created</div>
//           <div className=" col-span-1 text-right">Actions</div>
//         </div>
//         <div className="bg-warm-gray flex-1 p-2">
//           {loading && productImages.length === 0 ? (
//             <div className="flex justify-center h-full items-center">
//               <LoadingSpinner />
//             </div>
//           ) : productImages.length === 0 ? (
//             <div className="flex justify-center h-full items-center">
//               <p className=" text-lg text-center text-cold-gray/80">
//                 No product images found. Upload your first image!
//               </p>
//             </div>
//           ) : (
//             productImages.map((item) => (
//               <div
//                 key={item._id}
//                 className="w-full grid grid-cols-4 items-center p-2 bg-off-black hover:bg-off-black/80 r"
//               >
//                 <div
//                   onClick={() => setViewingItem(item)}
//                   className=" col-span-1"
//                 >
//                   <div className="w-16 h-16 rounded-sm cursor-pointer">
//                     {" "}
//                     <Image
//                       src={item.image}
//                       alt="Product"
//                       styles="w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//                 <div className=" col-span-1 text-center">
//                   <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//                     {item.hotspots.length} hotspot
//                     {item.hotspots.length !== 1 ? "s" : ""}
//                   </span>
//                 </div>
//                 <div className="col-span-1 text-center text-sm text-cold-gray/80">
//                   {formatDate(item?.createdAt || "")}
//                 </div>

//                 <div className="col-span-1 flex justify-end">
//                   <button
//                     onClick={() => setViewingItem(item)}
//                     className="text-blue-600 hover:text-blue-900 p-1"
//                     title="View"
//                   >
//                     <FaEye className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => startEdit(item)}
//                     className="text-indigo-600 hover:text-indigo-900 p-1"
//                     title="Edit"
//                   >
//                     <FaEdit className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => item._id && handleDelete(item._id)}
//                     className="text-red-600 hover:text-red-900 p-1"
//                     title="Delete"
//                   >
//                     <FaTrash className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductImageManager;

import React, { useState, useEffect, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { FaEye, FaMapPin, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { FiEdit3, FiUpload } from "react-icons/fi";
import { MdBlock } from "react-icons/md";

import { getProducts } from "../../services/productService";
import type { IProduct } from "../../types/Product";
import Image from "../../components/Images/Image";
import Button from "../../components/Buttons/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDate } from "../../utils/formData";
import {
  createProductImage,
  deleteProductImages,
  getAllProductImages,
  updateProductImage,
} from "../../services/productImageService";

// Types matching your Mongoose schema
interface IHotspot {
  positionX: number;
  positionY: number;
  product: IProduct;
}

interface IProductImage {
  _id?: string;
  image: string;
  hotspots: IHotspot[];
  createdAt?: string;
  updatedAt?: string;
}

// Product Selection Modal
const ProductSelectionModal: React.FC<{
  position: { x: number; y: number };
  onSave: (product: IProduct) => void;
  onCancel: () => void;
}> = ({ position, onSave, onCancel }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [name, setName] = useState("");

  const handleSave = () => {
    if (product) {
      onSave(product);
    }
  };

  const fetchProductByName = async () => {
    try {
      const {
        data: { products },
      } = await getProducts({ name });
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProductByName();
  }, [name]);

  return (
    <div className="fixed inset-0 bg-warm-gray/90 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-off-black rounded-lg p-6 w-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-2 text-left">Add Hotspot</h3>
          <p className="text-sm text-cold-gray/80 mb-4">
            Position: {position.x.toFixed(1)}%, {position.y.toFixed(1)}%
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-cold-gray/90 text-left mb-0.5">
            Product Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-off-white bg-off-black border border-cold-gray/70 focus:border-cold-gray shadow-xs focus:shadow-lg shadow-off-white/10 px-3 py-2.5 duration-200 rounded-sm placeholder:text-cold-gray/70"
            placeholder="Enter product name..."
            autoFocus
          />
        </div>
        <div className="h-[400px] overflow-y-auto p-2 pb-0 bg-warm-gray">
          {products.map((prod) => (
            <div
              onClick={() => setProduct(prod)}
              className={`flex items-center gap-3 p-2 mb-2 hover:bg-primary/90 rounded cursor-pointer ${
                product?._id === prod._id ? "bg-primary/90" : "bg-off-black"
              }`}
              key={prod._id}
            >
              <Image
                src={prod.images[0]}
                alt={prod.name}
                fromServer
                styles="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{prod.name}</p>
                <p className="text-xs text-cold-gray text-left">
                  {prod.price} DA
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-3 mt-4">
          <Button
            styles="flex-1"
            content={"Cancel"}
            action={onCancel}
            variant="secondary"
          />
          <Button
            styles="flex-1"
            content={"Add Hotspot"}
            action={handleSave}
            disabled={!product}
          />
        </div>
      </div>
    </div>
  );
};

// Interactive Image Editor
const ImageEditor: React.FC<{
  imageUrl: string;
  hotspots: IHotspot[];
  onHotspotAdd: (hotspot: IHotspot) => void;
  onHotspotEdit: (index: number) => void;
  onHotspotDelete: (index: number) => void;
  isEditable?: boolean;
}> = ({
  imageUrl,
  hotspots,
  onHotspotAdd,
  onHotspotEdit,
  isEditable = false,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [pendingPosition, setPendingPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isEditable) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPendingPosition({ x, y });
    setShowProductModal(true);
  };

  const handleAddHotspot = (product: IProduct) => {
    if (pendingPosition) {
      onHotspotAdd({
        positionX: pendingPosition.x,
        positionY: pendingPosition.y,
        product,
      });
    }
    setShowProductModal(false);
    setPendingPosition(null);
  };

  const handleHotspotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (isEditable) {
      onHotspotEdit(index);
    }
  };

  return (
    <div className="relative inline-block h-full w-[400px]">
      <img
        ref={imageRef}
        src={
          imageUrl.includes("http")
            ? imageUrl
            : import.meta.env.VITE_SERVER_URL + imageUrl
        }
        alt="Product"
        className={`w-full h-auto object-cover rounded-sm ${
          isEditable ? "cursor-crosshair" : ""
        }`}
        style={{ maxHeight: "500px" }}
        onClick={handleImageClick}
        onError={(e) => {
          e.currentTarget.src =
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE5NVYxNDVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE1MCA5MEgyNTBWMjEwSDE1MFY5MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==";
        }}
      />

      {/* Hotspot Markers */}
      {hotspots.map((hotspot, index) => (
        <button
          key={index}
          onClick={(e) => handleHotspotClick(e, index)}
          className="absolute w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg hover:bg-red-600 transition-all transform hover:scale-110 flex items-center justify-center group"
          style={{
            left: `${hotspot.positionX}%`,
            top: `${hotspot.positionY}%`,
            transform: "translate(-50%, -50%)",
          }}
          title={hotspot.product._id}
        >
          <FaMapPin className="w-4 h-4 text-white" />

          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <span>{hotspot.product.name} </span>
            {isEditable && (
              <>
                <br />
                <span className="text-gray-300">Click to edit</span>
              </>
            )}
          </div>
        </button>
      ))}

      {/* Click instruction */}
      {isEditable && hotspots.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/80 bg-opacity-50 text-white px-4 py-2 rounded-lg">
            Click on the image to add hotspots
          </div>
        </div>
      )}

      {/* Product Selection Modal */}
      {showProductModal && pendingPosition && (
        <ProductSelectionModal
          position={pendingPosition}
          onSave={handleAddHotspot}
          onCancel={() => {
            setShowProductModal(false);
            setPendingPosition(null);
          }}
        />
      )}
    </div>
  );
};

// Edit Hotspot Modal
const EditHotspotModal: React.FC<{
  hotspot: IHotspot;
  onSave: (updatedHotspot: IHotspot) => void;
  onDelete: () => void;
  onCancel: () => void;
}> = ({ hotspot, onSave, onDelete, onCancel }) => {
  const [product, setProduct] = useState(hotspot.product);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [name, setName] = useState("");

  const handleSave = () => {
    if (product) {
      onSave({ ...hotspot, product });
    }
  };

  const fetchProductByName = async () => {
    try {
      const {
        data: { products },
      } = await getProducts({ name });
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProductByName();
  }, [name]);

  return (
    <div className="fixed inset-0 bg-warm-gray/90 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-off-black rounded-sm p-3 w-xl">
        <h3 className="text-lg font-semibold mb-2">Edit Hotspot</h3>
        <p className="text-xs text-cold-gray/90 mb-4">
          Position: {hotspot.positionX.toFixed(1)}%,{" "}
          {hotspot.positionY.toFixed(1)}%
        </p>
        <div className="mb-4">
          <label className="capitalize text-sm mb-2">Product Name</label>
          <input
            type="text"
            value={name}
            placeholder="Search By Name"
            onChange={(e) => setName(e.target.value)}
            className={`w-full text-off-white bg-off-black border border-cold-gray/70 focus:border-cold-gray shadow-xs focus:shadow-lg shadow-off-white/10 px-3 py-2.5 duration-200 rounded-sm placeholder:text-cold-gray/70`}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>
        <div className="h-[400px] overflow-y-auto bg-warm-gray p-2 flex flex-col gap-2 mb-4">
          {products.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <MdBlock className="text-2xl mr-2" /> No Product Match This Name
            </div>
          )}
          {products.map((prod) => (
            <div
              onClick={() => setProduct(prod)}
              className="flex bg-off-black hover:bg-off-black/70 cursor-pointer rounded-sm p-2 gap-2"
              key={prod._id}
            >
              <Image
                src={prod.images[0]}
                alt={prod.name}
                fromServer
                styles="w-16 h-16 object-cover rounded-sm"
              />{" "}
              <div>
                <p> {prod.name} </p>
                <p className="text-cold-gray/80 text-sm"> {prod.price} DA </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button
            styles="flex-1"
            action={onCancel}
            content="Cancel"
            variant="secondary"
          />
          <Button
            styles="flex-1"
            action={onDelete}
            content="Delete"
            variant="delete"
          />
          <Button
            styles="flex-1"
            action={handleSave}
            disabled={!product}
            content="Save"
            variant="cta"
          />
        </div>
      </div>
    </div>
  );
};

// File Upload Component
const ImageUploader: React.FC<{
  onImageSelect: (file: File) => void;
}> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
      >
        <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Click to upload an image</p>
        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
      </button>
    </div>
  );
};

// Main Component
const ProductImageManager: React.FC = () => {
  const [productImages, setProductImages] = useState<IProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<IProductImage | null>(null);
  const [viewingItem, setViewingItem] = useState<IProductImage | null>(null);
  const [editingHotspot, setEditingHotspot] = useState<{
    hotspot: IHotspot;
    index: number;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    image: File | null;
    imagePreview: string | null;
    hotspots: IHotspot[];
  }>({
    image: null,
    imagePreview: null,
    hotspots: [],
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const {
        data: { productImages },
      } = await getAllProductImages();
      setProductImages(productImages);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.image) return;

    const formDataToSend = new FormData();
    formDataToSend.append("image", formData.image);
    formDataToSend.append("hotspots", JSON.stringify(formData.hotspots));

    setLoading(true);
    try {
      const {
        data: { productImage },
      } = await createProductImage(formDataToSend);
      setProductImages([...productImages, productImage]);
      resetForm();
    } catch (error) {
      console.error("Error creating item:", error);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!editingItem?._id || !formData.image) return;

    const formDataToSend = new FormData();
    if (formData.image) formDataToSend.append("image", formData.image);
    formDataToSend.append("hotspots", JSON.stringify(formData.hotspots));

    setLoading(true);
    try {
      await updateProductImage(editingItem._id, formDataToSend);
      await loadData();
      resetForm();
    } catch (error) {
      console.error("Error updating item:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteProductImages(id);
      await loadData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      image: null,
      imagePreview: null,
      hotspots: [],
    });
    setShowForm(false);
    setEditingItem(null);
    setEditingHotspot(null);
  };

  const startEdit = (item: IProductImage) => {
    setEditingItem(item);
    setFormData({
      image: null,
      imagePreview: item.image,
      hotspots: [...item.hotspots],
    });
    setShowForm(true);
  };

  const handleImageSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setFormData({
      ...formData,
      image: file,
      imagePreview: previewUrl,
    });
  };

  const handleHotspotAdd = (hotspot: IHotspot) => {
    setFormData({
      ...formData,
      hotspots: [...formData.hotspots, hotspot],
    });
  };

  const handleHotspotEdit = (index: number) => {
    setEditingHotspot({
      hotspot: formData.hotspots[index],
      index,
    });
  };

  const handleHotspotSave = (updatedHotspot: IHotspot) => {
    if (editingHotspot) {
      const newHotspots = [...formData.hotspots];
      newHotspots[editingHotspot.index] = updatedHotspot;
      setFormData({ ...formData, hotspots: newHotspots });
      setEditingHotspot(null);
    }
  };

  const handleHotspotDelete = () => {
    if (editingHotspot) {
      const newHotspots = formData.hotspots.filter(
        (_, i) => i !== editingHotspot.index
      );
      setFormData({ ...formData, hotspots: newHotspots });
      setEditingHotspot(null);
    }
  };

  return (
    <div className="h-full w-full flex flex-col gap-3">
      <div className="flex items-center justify-between bg-off-black p-3">
        <div>
          <h1 className="text-xl font-bold mb-0.5">Product Image Management</h1>
          <p className="text-cold-gray/70 text-sm">
            Upload images and click to add interactive hotspots
          </p>
        </div>
        <Button
          content={
            <>
              <FaPlus className="w-5 h-5" />
              <span>Add New Image</span>
            </>
          }
          action={() => setShowForm(true)}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-warm-gray/90 bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-off-black rounded-lg p-3 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-3">
              {editingItem ? "Edit Product Image" : "Add New Product Image"}
            </h2>

            <div className="flex items-start gap-5">
              {/* Image Upload/Display */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3">Image</h3>
                {!formData.imagePreview ? (
                  <ImageUploader onImageSelect={handleImageSelect} />
                ) : (
                  <div className="space-y-4">
                    <div className="text-center relative">
                      <ImageEditor
                        imageUrl={formData.imagePreview}
                        hotspots={formData.hotspots}
                        onHotspotAdd={handleHotspotAdd}
                        onHotspotEdit={handleHotspotEdit}
                        onHotspotDelete={handleHotspotDelete}
                        isEditable={true}
                      />
                      <Button
                        action={() =>
                          setFormData({
                            ...formData,
                            image: null,
                            imagePreview: null,
                          })
                        }
                        content="Change Image"
                        variant="warning"
                        styles="top-1.5 right-5 absolute mr-0 ml-auto"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1">
                {/* Hotspots List */}
                {formData.hotspots.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mb-3">
                      Hotspots ({formData.hotspots.length})
                    </h3>
                    <div className="grid gap-3">
                      {formData.hotspots.map((hotspot, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-warm-gray mb-2 rounded-sm"
                        >
                          <div className="flex gap-2">
                            <Image
                              fromServer
                              src={hotspot.product.images[0]}
                              alt={hotspot.product.name}
                              styles="w-16 h-16 object-cover rounded-sm"
                            />
                            <div>
                              <p className="text-lg">{hotspot.product.name}</p>
                              <p className="text-sm text-cold-gray/80">
                                Position: {hotspot.positionX.toFixed(1)}%,{" "}
                                {hotspot.positionY.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleHotspotEdit(index)}
                            className="p-2 text-primary flex justify-center items-center cursor-pointer hover:bg-blue-50 rounded"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <Button
                    action={resetForm}
                    disabled={loading}
                    content="Cancel"
                    variant="secondary"
                  />
                  <Button
                    action={editingItem ? handleUpdate : handleCreate}
                    disabled={loading || !formData.image}
                    content={editingItem ? "Update" : "Create"}
                    variant="info"
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hotspot Modal */}
      {editingHotspot && (
        <EditHotspotModal
          hotspot={editingHotspot.hotspot}
          onSave={handleHotspotSave}
          onDelete={handleHotspotDelete}
          onCancel={() => setEditingHotspot(null)}
        />
      )}

      {/* View Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-warm-gray/90 bg-opacity-50 flex items-center justify-center p-3 z-40">
          <div className="bg-off-black rounded-sm p-4 pt-2 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">View Product Image</h2>
              <button
                onClick={() => setViewingItem(null)}
                className="text-cold-gray/70 hover:text-off-white cursor-pointer duration-200"
              >
                <FaXmark className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center flex-1 flex items-start gap-5">
              <ImageEditor
                imageUrl={viewingItem.image}
                hotspots={viewingItem.hotspots}
                onHotspotAdd={() => {}}
                onHotspotEdit={() => {}}
                onHotspotDelete={() => {}}
                isEditable={false}
              />

              {viewingItem.hotspots.length > 0 && (
                <div className="flex-1 h-full flex flex-col min-h-0">
                  <h3 className="text-lg font-semibold mb-2 text-left">
                    Hotspots:
                  </h3>
                  <div className="overflow-y-auto flex-1 min-h-0">
                    {viewingItem.hotspots.map((hotspot, index) => (
                      <div
                        key={index}
                        className="p-3 bg-warm-gray rounded-sm mb-2 flex gap-3"
                      >
                        <div className="w-16 h-16 rounded-sm overflow-hidden">
                          <Image
                            src={
                              hotspot.product?.images
                                ? hotspot.product?.images[0]
                                : ""
                            }
                            alt={hotspot.product.name}
                            fromServer
                          />
                        </div>
                        <div className="">
                          <p className="text-left text-lg">
                            {hotspot.product.name}
                          </p>
                          <p className="text-cold-gray/80 text-sm font-medium">
                            Position: {hotspot.positionX.toFixed(1)}%,{" "}
                            {hotspot.positionY.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-off-black flex-1 p-3 overflow-hidden flex flex-col">
        <div className="grid grid-cols-4 pb-3 text-xs text-cold-gray/70 uppercase">
          <div className="col-span-1">Image</div>
          <div className="col-span-1 text-center">Hotspots</div>
          <div className="col-span-1 text-center">Created</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        <div className="bg-warm-gray flex-1 p-2 overflow-y-auto">
          {loading && productImages.length === 0 ? (
            <div className="flex justify-center h-full items-center">
              <LoadingSpinner />
            </div>
          ) : productImages.length === 0 ? (
            <div className="flex justify-center h-full items-center">
              <p className="text-lg text-center text-cold-gray/80">
                No product images found. Upload your first image!
              </p>
            </div>
          ) : (
            productImages.map((item) => (
              <div
                key={item._id}
                className="w-full grid grid-cols-4 items-center p-2 bg-off-black hover:bg-off-black/80 mb-2 last:mb-0"
              >
                <div
                  onClick={() => setViewingItem(item)}
                  className="col-span-1 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-sm">
                    <Image
                      src={item.image}
                      alt="Product"
                      styles="w-full h-full object-cover"
                      fromServer
                    />
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {item.hotspots.length} hotspot
                    {item.hotspots.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="col-span-1 text-center text-sm text-cold-gray/80">
                  {formatDate(item?.createdAt || "")}
                </div>

                <div className="col-span-1 flex items-center justify-end gap-2 text-cold-gray/80 ">
                  <button
                    onClick={() => setViewingItem(item)}
                    title="View"
                    className="p-2 cursor-pointer  hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    title="Edit"
                    className="p-2 cursor-pointer  hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  >
                    <FiEdit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => item._id && handleDelete(item._id)}
                    title="Delete"
                    className="p-2 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImageManager;
