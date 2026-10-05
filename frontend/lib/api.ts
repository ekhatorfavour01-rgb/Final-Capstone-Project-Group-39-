export type ApiProduct = {
    _id: string;
    name: string;
    brand?: string;
    description?: string;
    price: number;
    oldPrice?: number;
    discount?: string;
    stock: number;
    category: string;
    color?: string;
    rating?: number;
    badge?: string;
    image?: string;
};

export type ApiCart = {
    items: Array<{
        product: ApiProduct | null;
        quantity: number;
    }>;
};

export type ApiUser = {
    _id: string;
    name: string;
    email: string;
    role: string;
};

export type AuthResult = {
    user: ApiUser;
    token: string;
};

export type ApiOrder = {
    _id: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt?: string;
};
const API_REQUEST_TIMEOUT_MS = 15_000;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(
    /\/+$/,
    "",
);

export const apiConfigured = Boolean(API_BASE_URL);

async function request<T>(
    path: string,
    options: RequestInit = {},
    token?: string,
): Promise<T> {
    if (!API_BASE_URL) {
        throw new Error(
            "Set NEXT_PUBLIC_API_BASE_URL to connect to the backend.",
        );
    }

    const headers = new Headers(options.headers);
    if (options.body) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    let response: Response;
    try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
        () => controller.abort(),
        API_REQUEST_TIMEOUT_MS,
    );

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers,
            cache: "no-store",
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeoutId);
    }
} catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
            "The backend request timed out. Please try again.",
        );
    }

    throw new Error(
        "Could not reach the backend. Check its URL and CORS configuration.",
    );
}

    const result = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        data?: T;
    } | null;

    if (!response.ok || !result?.success) {
        throw new Error(
            result?.message || `Backend request failed (${response.status}).`,
        );
    }

    return result.data as T;
}

export function fetchProducts() {
    return request<{ products: ApiProduct[] }>(
        "/api/products?limit=100&page=1",
    );
}

export function login(email: string, password: string) {
    return request<AuthResult>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export function register(name: string, email: string, password: string) {
    return request<AuthResult>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });
}

export function fetchCart(token: string) {
    return request<ApiCart>("/api/cart", {}, token);
}

export function addCartItem(token: string, productId: string, quantity = 1) {
    return request<ApiCart>(
        "/api/cart",
        {
            method: "POST",
            body: JSON.stringify({ productId, quantity }),
        },
        token,
    );
}

export function updateCartItem(
    token: string,
    productId: string,
    quantity: number,
) {
    return request<ApiCart>(
        `/api/cart/${encodeURIComponent(productId)}`,
        {
            method: "PATCH",
            body: JSON.stringify({ quantity }),
        },
        token,
    );
}

export function removeCartItem(token: string, productId: string) {
    return request<ApiCart>(
        `/api/cart/${encodeURIComponent(productId)}`,
        {
            method: "DELETE",
        },
        token,
    );
}

export function clearCart(token: string) {
    return request<ApiCart>("/api/cart", { method: "DELETE" }, token);
}

export function placeOrder(token: string, shippingAddress: string) {
    return request<ApiOrder>(
        "/api/orders",
        {
            method: "POST",
            body: JSON.stringify({ shippingAddress }),
        },
        token,
    );
}

export function fetchOrders(token: string) {
    return request<ApiOrder[]>("/api/orders/my-orders", {}, token);
}
