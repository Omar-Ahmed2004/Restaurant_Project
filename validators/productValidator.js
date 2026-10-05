export const validateProduct = (data) => {
    const { name, description, price, image } = data;

    if (!name || !name.trim()) {
        return "Product name is required";
    }

    if (!description || !description.trim()) {
        return "Product description is required";
    }

    if (price === undefined || price === null || price === "") {
        return "Product price is required";
    }

    if (Number.isNaN(Number(price)) || Number(price) <= 0) {
        return "Product price must be greater than 0";
    }

    if (!image) {
        return "Product image is required";
    }

    return null;
};