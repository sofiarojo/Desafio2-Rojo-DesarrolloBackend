//Desafio de la Clase 3

const fs = require ("fs");

class ProductManager {
    constructor (path) {
        this.path = path;
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const info = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(info);
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    async addProduct(productData) {
        try {
            const products = await this.getProducts();
            let id = 1;
            if (products.length > 0) {
                id = Math.max (...products.map((product) => product.id)) + 1;
            }

            const product = { id, ...productData };
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
        } catch (error) {
            return error;
        }
    }

    async getProductsById (productId) {
        try {
            const products = await this.getProducts();
            const product = products.find((p) => p.id === productId);
            if (product) {
                return product
            } else {
                return "No product";
            }
        } catch (error) {
            return error;
        }
    }

    async updateProduct (productId, updateData) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex((p) => p.id === productId);
            if (index !== -1) {
                products[index] = { ...products [index], ...updateData };
                await fs.promises.writeFile (this.path, JSON.stringify (products));
                return products [index];
            } else {
                return "Product not found";
            }
        } catch (error) {
            return error;
        }
    }

    async deleteProduct (productId) {
        try {
            const products = await this.getProducts();
            const newProducts = products.filter((p) => p.id !== productId);
            await fs.promises.writeFile(this.path, JSON.stringify(newProducts));
        } catch (error){
            return error;
        }
    }
}


//Ejemplo de uso:
async function test () {
    const manager = new ProductManager ("products.json");

    //Agregar un producto
    await manager.addProduct ({
        title: "Ashtanga Yoga",
        description: "Curso para nivel intermedio",
        price: 7500,
        thumbnail: "img1.jpg",
        code: "abc123",
        stock: 10,
    });

    await manager.addProduct ({
        title: "Hatha Yoga",
        description: "Curso para nivel inicial",
        price: 6250,
        thumbnail: "img2.jpg",
        code: "def456",
        stock: 7,
    });

    await manager.addProduct ({
        title: "Vinyasa Yoga",
        description: "Curso para nivel avanzado",
        price: 8000,
        thumbnail: "img3.jpg",
        code: "ghi789",
        stock: 5,
    });

    await manager.addProduct ({
        title: "Yoga Terapéutico",
        description: "Curso para nivel inicial",
        price: 6500,
        thumbnail: "img4.jpg",
        code: "jkl101",
        stock: 9,
    });

    //Obtener todos los productos
    const products = await manager.getProducts();
    console.log(products);

    //Obtener un producto por ID
    const product = await manager.getProductsById(2);
    console.log(product);

    //Actualizar un producto
    const updatedProduct = await manager.updateProduct(1, {
        price: 9000,
        stock:15,
    });
    console.log(updatedProduct);

    //Eliminar un producto
    await manager.deleteProduct(3);
    console.log("Delete Product");

    // Verificar la lista de los productos luego de eliminar alguno
    const updatedProducts = await manager.getProducts();
    console.log(updatedProducts);
}

test();