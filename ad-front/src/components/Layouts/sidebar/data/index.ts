import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "Omega Dashboard",
            url: "/dashboard",
          },
        ],
      },
      {
        title: "Products",
        icon: Icons.PackageIcon,
        items: [
          {
            title: "Add Product",
            url: "/products/add",
            icon: Icons.PlusIcon,
          },
          {
            title: "List Products",
            url: "/products/list",
            icon: Icons.ListIcon,
          },
          {
            title: "Categories",
            url: "/products/categories",
            icon: Icons.TagIcon,
          },
        ],
      },
      {
        title: "Users",
        icon: Icons.User,
        items: [
          {
            title: "User List",
            url: "/users/list",
            icon: Icons.ListIcon,
          },
          {
            title: "Orders",
            url: "/users/orders",
            icon: Icons.Table,
          },
        ],
      },
      {
        title: "Sellers",
        icon: Icons.SellerIcon,
        items: [
          {
            title: "Seller List",
            url: "/sellers/list",
            icon: Icons.ListIcon,
          },
          {
            title: "Add Seller",
            url: "/sellers/add",
            icon: Icons.PlusIcon,
          },
          {
            title: "Seller Reports",
            url: "/sellers/reports",
            icon: Icons.PieChart,
          },
        ],
      },
      {
        title: "Settings",
        icon: Icons.Authentication,
        items: [
          {
            title: "Currencies",
            url: "/settings/currencies",
            icon: Icons.CurrencyIcon,
          },
        ],
      },
    ]
  }
]
