import { Request, Response } from "express";
import { productSchema } from "../models/product.model.js";
import * as productService from "../services/product.service.js";

const parseErrors = (issues: Array<{ path: PropertyKey[]; message: string }>) =>
  issues.reduce<Record<string, string>>((acc, issue) => {
    acc[issue.path.join(".")] = issue.message;
    return acc;
  }, {});

export const getAll = async (req: Request, res: Response) => {
  try {
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const offset = Math.max(0, Number(req.query.offset) || 0);
    const search = String(req.query.search || "");
    res.json(await productService.getAllProducts(limit, offset, search));
  } catch {
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(Number(req.params.id));
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch {
    res.status(500).json({ error: "Failed to fetch product." });
  }
};

export const create = async (req: Request, res: Response) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parseErrors(parsed.error.issues) });
    return;
  }
  try {
    res.status(201).json(await productService.createProduct(parsed.data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: "Failed to create product.", detail: message });
  }
};

export const update = async (req: Request, res: Response) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parseErrors(parsed.error.issues) });
    return;
  }
  try {
    const product = await productService.updateProduct(Number(req.params.id), parsed.data);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch {
    res.status(400).json({ error: "Failed to update product." });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const deleted = await productService.deleteProduct(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully." });
  } catch {
    res.status(500).json({ error: "Failed to delete product." });
  }
};
