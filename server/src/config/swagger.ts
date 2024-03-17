import swaggerAutogen from "swagger-autogen";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("Missing required environment variables");
}

const PORT = parseInt(process.env.PORT, 10);
const options = {
  openapi: "3.0.0",
  autoHeaders: false,
};
const auth = {
  type: "http",
  scheme: "bearer",
};

const itemDTO = {
  $id: 1,
  $name: "Kayak",
};

const updateItemDTO = {
  ...itemDTO,
  description: "Go for a paddle",
};

const item = {
  ...itemDTO,
  imageUrl: "http://localhost:4000/images/1.jpg",
};

const itemDetailed = {
  ...item,
  description: "Go for a paddle",
};

const orderItem = {
  orderId: "262cb163-5ea4-41fa-87c1-a93fac8025c6",
  item: item,
  quantity: 2,
};

const createCustomerDTO = {
  name: "Kelsey Shiratori",
  email: "ks@gmail.com",
};

const customer = {
  ...createCustomerDTO,
  $id: "45b23d49-7297-43da-b853-3c7f42c7da6a",
};

const basicOrder = {
  $id: "262cb163-5ea4-41fa-87c1-a93fac8025c6",
  status: "Created",
  createdAt: "2024-02-08T02:32:51.630Z",
};

const order = {
  ...basicOrder,
  customer: customer,
};

const OrderDetail = {
  ...order,
  items: [orderItem],
};

const updateOrderDTO = {
  $id: "262cb163-5ea4-41fa-87c1-a93fac8025c6",
  status: "Created",
};

const orderDTO = {
  ...updateOrderDTO,
  customerId: "45b23d49-7297-43da-b853-3c7f42c7da6a",
};

const orderItemDTO = {
  itemId: 1,
  quantity: 2,
};

const docV1 = {
  info: {
    version: "v1.0.0",
    title: "Carved Rock Fitness API",
    description: "API for Rest Fundamentals course on Pluralsight",
  },
  servers: [{ url: `http://localhost:${PORT}/api/v1` }],
  components: {
    securitySchemes: {
      bearerAuth: auth,
    },
    schemas: {
      items: [item],
      item: item,
      itemDetailed: itemDetailed,
      itemDTO: itemDTO,
      updateItemDTO: updateItemDTO,
      customer: customer,
      customers: [customer],
      customerOrders: [basicOrder],
      createCustomerDTO: createCustomerDTO,
      updateCustomerDTO: customer,
      orders: [order],
      order: OrderDetail,
      orderDTO: orderDTO,
      updateOrderDTO: updateOrderDTO,
      orderItemsDTO: [orderItemDTO],
    },
  },
};

let outputFile = "../../public/swagger_output_v1.json";
let endpointFiles = ["./src/features/v1/routes.ts"];

swaggerAutogen(options)(outputFile, endpointFiles, docV1);

const itemV2 = {
  ...itemDTO,
  thumbnailImageUrl: "http://localhost:4000/images/thumbnails/1.jpg",
};

const itemDetailedV2 = {
  ...item,
  description: "Go for a paddle",
  staffReview: "This is an awesome product!",
  fullImageUrl: "http://localhost:4000/images/1.jpg",
};

const docV2 = {
  info: {
    version: "v2.0.0",
    title: "Carved Rock Fitness API",
    description: "API for Rest Fundamentals course on Pluralsight",
  },
  servers: [{ url: `http://localhost:${PORT}/api/v2` }],
  components: {
    schemas: {
      items: [itemV2],
      item: itemV2,
      itemDetailed: itemDetailedV2,
      itemDTO: itemDTO,
      updateItemDTO: updateItemDTO,
      customer: customer,
      customers: [customer],
      customerOrders: [basicOrder],
      createCustomerDTO: createCustomerDTO,
      updateCustomerDTO: customer,
      orders: [order],
      order: OrderDetail,
      orderDTO: orderDTO,
      updateOrderDTO: updateOrderDTO,
      orderItemsDTO: [orderItemDTO],
    },
  },
};

outputFile = "../../public/swagger_output_v2.json";
endpointFiles = ["./src/features/v2/routes.ts"];

swaggerAutogen(options)(outputFile, endpointFiles, docV2);
