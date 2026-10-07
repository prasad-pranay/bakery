"use client";

import { useMemo, useState } from "react";
import {
    ArrowDownUp,
    ArrowRight,
    Check,
    ChevronDown,
    ChevronRight,
    Heart,
    Menu,
    Minus,
    Plus,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Sparkles,
    Star,
    X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import QuickView from "./QuickView";
import { useEffect, useRef } from "react";
import {
    useReducedMotion,
} from "framer-motion";
import {Product,Category} from "../type/product";
import { useAuthStore } from "../store/authStore";
import { cartItemType, cartAddBackend, cartUpdateBackend, cartItemRemove } from "../type/cart";
/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */




const categories: {
    name: Category;
    icon: React.JSX.Element;
}[] = [
        { name: "All", icon: <svg className="size-6" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M26 8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2zm-2-8h-4a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4m2 24a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2zm-2-8h-4a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-4a4 4 0 0 0-4-4M10 8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2zM8 0H4a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4m2 24a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2zm-2-8H4a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-4a4 4 0 0 0-4-4" fillRule="evenodd" /></svg> },
        { name: "Cookies", icon: <svg className="size-6" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" ><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M59.896 23.918c-.245-.771-.443-1.315-.476-1.514a5 5 0 0 1-1.29.156c-.775 0-1.67-.15-2.594-.525-2.065-.838-3.416-2.459-3.786-4.514-.233.066-.546.1-.909.1-1.17 0-2.865-.353-4.116-1.137-2.388-1.496-2.862-5.666-2.862-5.666-2.705-.783-4.739-3.965-4.414-6.672C37.024 3.494 34.628 2 31.999 2c-2.633 0-5.033 1.502-7.461 2.15-2.514.672-5.342.592-7.54 1.863-2.232 1.293-3.568 3.793-5.379 5.604-1.813 1.813-4.313 3.148-5.604 5.379-1.273 2.201-1.191 5.027-1.863 7.541C3.504 26.965 2 29.368 2 31.999c0 2.632 1.504 5.033 2.152 7.462.672 2.512.59 5.34 1.863 7.539 1.291 2.232 3.791 3.568 5.604 5.379 1.811 1.811 3.146 4.313 5.379 5.604 2.198 1.275 5.026 1.193 7.54 1.865 2.428.65 4.828 2.152 7.461 2.152 2.635 0 5.035-1.502 7.465-2.152 2.512-.672 5.34-.59 7.538-1.865 2.232-1.291 3.568-3.793 5.379-5.604 1.813-1.811 4.313-3.146 5.604-5.379 1.273-2.199 1.191-5.027 1.863-7.539.648-2.43 2.152-4.83 2.152-7.462s-2.104-8.081-2.104-8.081m-1.025 7.426c-.124.816-.739 1.691-1.393 2.617-.711 1.01-1.518 2.156-1.883 3.527-.248.926-.39 1.85-.527 2.744-.215 1.395-.417 2.711-.979 3.684-.575.992-1.619 1.826-2.724 2.709-.702.561-1.428 1.139-2.097 1.809-.669.668-1.249 1.395-1.81 2.098-.883 1.104-1.716 2.146-2.71 2.723-.971.563-2.286.766-3.679.979-.895.139-1.82.281-2.745.529-.892.238-1.741.57-2.563.895-1.324.52-2.575 1.01-3.763 1.01s-2.438-.492-3.763-1.012c-.82-.322-1.669-.654-2.559-.893-.927-.248-1.853-.391-2.747-.529-1.394-.213-2.709-.416-3.682-.979-.993-.574-1.826-1.619-2.707-2.723-.562-.703-1.142-1.43-1.811-2.098-.669-.67-1.395-1.248-2.097-1.809-1.104-.883-2.148-1.717-2.723-2.709-.563-.973-.766-2.289-.98-3.684-.138-.895-.279-1.818-.526-2.742-.238-.895-.573-1.746-.896-2.57C6.99 33.598 6.5 32.35 6.5 31.167c0-1.186.49-2.436 1.01-3.758.323-.823.657-1.674.896-2.566.247-.926.389-1.85.526-2.745.215-1.394.417-2.711.979-3.684.575-.993 1.619-1.826 2.724-2.708.702-.561 1.428-1.14 2.097-1.809s1.249-1.395 1.811-2.097c.882-1.104 1.715-2.147 2.706-2.722.973-.563 2.289-.765 3.683-.98.895-.138 1.82-.28 2.745-.528.892-.238 1.742-.571 2.563-.894 1.324-.519 2.574-1.009 3.76-1.009q.513 0 1.047-.005.536-.004 1.085-.005c1.136 0 2.301.023 3.36.153.388 2.682 2.187 5.234 4.596 6.449.369 1.652 1.312 4.502 3.575 5.92 1.488.933 3.28 1.339 4.637 1.425.824 1.919 2.393 3.436 4.484 4.285a9 9 0 0 0 3.217.671c.511 1.626 1.238 4.358.87 6.784M48.731 9.453l1.375 1.375-1.375 1.375-1.375-1.375zm6.42 7.604.697.699-.7.698-.697-.699z" /><path d="m50.806 13.218-.697.697-.698-.698.697-.697zm-6.947-6.782.696.699-.7.698-.697-.699zm12.689 14.599-.699-.697.696-.699.7.697zm.517-3.978.697.699-.7.698-.697-.699zM20.66 24.613c.62-1.076 1.413-3.979 1.115-4.662-.436-1.002-2.106-2.971-3.198-2.977-3.124-.014-6.06 2.426-6.77 3.646-.967 1.662.501 4.844 2.455 5.654 2.927 1.217 4.638 1.398 6.398-1.661m21.915 7.446c-.929.252-2.952 1.406-3.162 1.943-.312.787-.474 2.779.121 3.381 1.703 1.717 4.646 1.99 5.702 1.711 1.439-.381 2.376-2.928 1.752-4.441-.937-2.268-1.775-3.303-4.413-2.594M21.051 42.998c-1.967.813-2.866 1.541-2.25 3.828.218.807 1.219 2.561 1.685 2.744.683.27 2.412.41 2.933-.105 1.49-1.479 1.727-4.029 1.484-4.947-.331-1.248-2.54-2.061-3.852-1.52m30.044-17.48c-1.249.33-2.062 2.54-1.52 3.852.813 1.967 2.699 2.301 4.794 1.191 1.771-.938 1.892-4.145 1.375-4.667-1.477-1.49-3.732-.619-4.649-.376m-26.371-7.432-2.004-2.004 2.004-2.004 2.004 2.004zM14.667 33.51l2.005-2.003 2.003 2.004-2.004 2.003zm22.036 13.327L34.7 44.833l2.004-2.004 2.004 2.004zm-2.001-10.274 2.7 2.7-2.7 2.7-2.7-2.7zm-7.278-24.03-2.699-2.699 2.7-2.7 2.699 2.7zm15.735 35.792-2.004-2.004 2.004-2.004 2.004 2.004zm7.937-11.061-2.004-2.004 2.004-2.004L53.1 35.26zm-8.249-13.649 1 1-1 1-1-1zM14.668 39.264l-1-1 1-1 1 1z" /></svg> },
        { name: "Cake", icon: <svg className="size-6" height="200" width="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlSpace="preserve"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M505.822 141.442c-6.987-14.224-18.973-26.423-34.368-37.08-23.162-15.953-54.417-28.598-91.228-37.5-36.792-8.863-79.122-13.88-124.23-13.88-68.726.028-130.994 11.586-177.134 30.884-23.07 9.709-42.181 21.322-56.117 35.083-6.95 6.902-12.599 14.363-16.575 22.493-3.958 8.102-6.178 16.901-6.17 25.931v177.254c-.008 9.012 2.212 17.82 6.17 25.922 6.986 14.215 18.972 26.423 34.377 37.09 23.162 15.943 54.417 28.588 91.218 37.498 36.793 8.864 79.132 13.881 124.231 13.881 68.735-.028 130.994-11.586 177.132-30.902 23.079-9.69 42.191-21.313 56.118-35.083 6.949-6.884 12.598-14.363 16.575-22.484 3.966-8.102 6.187-16.91 6.178-25.922V167.373c.009-9.031-2.211-17.829-6.177-25.931M67.463 126.623c6.308-4.72 13.704-8.744 21.666-12.376 7.962-3.623 16.472-6.829 24.853-9.607 16.808-5.547 32.872-9.318 43.166-10.814 6.634-.938 12.785 3.661 13.723 10.304.948 6.624-3.651 12.775-10.286 13.713-6.048.856-16.352 3.086-27.538 6.309-11.205 3.205-23.469 7.433-33.838 12.181-6.913 3.131-12.99 6.541-17.189 9.718-5.37 4.005-12.97 2.927-16.984-2.434-4.022-5.362-2.934-12.972 2.427-16.994m420.269 218.004c-.009 5.091-1.199 10.071-3.726 15.283-4.386 9.068-13.23 18.731-26.34 27.743-19.604 13.565-48.434 25.541-83.126 33.876-34.693 8.38-75.257 13.22-118.544 13.22-65.938.028-125.623-11.307-167.75-29.006-21.053-8.808-37.656-19.233-48.406-29.936-5.389-5.332-9.328-10.713-11.856-15.897-2.527-5.212-3.716-10.192-3.716-15.283V320.07c4.85 4.636 10.294 9.003 16.278 13.146 23.162 15.944 54.417 28.598 91.218 37.498 36.793 8.864 79.132 13.881 124.231 13.881 68.735-.018 130.994-11.585 177.132-30.902 22.28-9.356 40.806-20.515 54.604-33.661zm0-74.431c-.009 5.1-1.199 10.099-3.726 15.293-4.386 9.069-13.23 18.74-26.34 27.752-19.604 13.565-48.434 25.542-83.126 33.894-34.693 8.362-75.257 13.203-118.544 13.203-65.938.028-125.623-11.316-167.75-29.016-21.053-8.808-37.656-19.232-48.406-29.926-5.389-5.342-9.328-10.721-11.856-15.906-2.527-5.194-3.716-10.192-3.716-15.293V265.3c2.277.558 4.646.892 7.08.892 16.574 0 30.01-13.425 30.01-30.01V225.59c.008-4.18 1.672-7.878 4.412-10.647 2.751-2.731 6.449-4.394 10.629-4.394 4.19 0 7.888 1.663 10.648 4.394 2.74 2.769 4.394 6.467 4.403 10.647v37.322c.01 19.056 15.433 34.461 34.461 34.469 19.038-.008 34.461-15.414 34.47-34.469V247.87c0-4.19 1.663-7.879 4.403-10.638 2.75-2.732 6.448-4.404 10.638-4.404s7.888 1.672 10.639 4.404c2.731 2.759 4.404 6.448 4.404 10.638v45.154c.018 20.236 16.398 36.625 36.634 36.625 20.226-.008 36.616-16.389 36.625-36.625v-26.089c0-4.784 1.904-9.04 5.044-12.18s7.386-5.036 12.162-5.045c4.794.009 9.031 1.904 12.18 5.045 3.122 3.149 5.036 7.395 5.036 12.18v10.927c.019 19.038 15.433 34.451 34.461 34.451 19.037 0 34.46-15.414 34.46-34.451v-34.656c.018-4.784 1.914-9.012 5.044-12.162 3.15-3.131 7.387-5.036 12.181-5.036 4.776 0 9.022 1.904 12.171 5.036 3.122 3.149 5.036 7.377 5.036 12.162v15.516c.009 17.356 14.057 31.412 31.404 31.412 17.356 0 31.404-14.057 31.422-31.412v-44.949c0-3.336 1.32-6.263 3.494-8.446 2.202-2.184 5.129-3.513 8.455-3.513s6.262 1.329 8.455 3.513c1.43 1.439 2.443 3.223 3 5.212v59.657z" style={{ "fill": "#000" }} /></svg> },
        { name: "Pastries", icon: <svg className="size-6" height="200" width="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlSpace="preserve"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M512 275.052c-.038-4.608-1.333-8.486-3.276-12.005-1.889-3.283-4.418-6.331-8.296-8.692l.023-.038-219.034-139.124c-14.923-34.364-43.224-51.306-61.933-51.306-4.357 0-9.263 1.005-14.375 2.842l-13.674-8.684-.068-.038c-7.237-4.403-15.494-5.812-24.347-5.858-9.24.016-19.318 1.699-29.908 4.8-15.867 4.67-32.863 12.592-48.989 23.63-16.104 11.038-31.325 25.215-43.247 42.538-16.455 23.942-27.645 47.916-34.737 69.862C3.047 214.948.015 234.838 0 251.025c.008 2.842.13 5.539.32 8.167v164.712c.008 19.86 16.096 35.941 35.948 35.948h435.456c19.479-.007 35.385-15.494 35.941-34.942l4.091-147.519h-.038c.084-.777.282-1.6.282-2.339M260.087 158.004c.556-6.407 3.565-11.412 6.704-11.175 3.146.236 5.24 5.63 4.684 12.044-.563 6.399-3.565 11.404-6.711 11.16-3.146-.236-5.233-5.622-4.677-12.029m-12.531-53.476c3.123-.45 6.506 4.334 7.572 10.688 1.052 6.361-.617 11.869-3.733 12.318s-6.506-4.327-7.572-10.681c-1.051-6.353.617-11.868 3.733-12.325m-7.466 97.37c.556-6.399 3.558-11.396 6.712-11.16 3.138.236 5.233 5.622 4.677 12.029s-3.558 11.412-6.712 11.175c-3.145-.236-5.241-5.629-4.677-12.044m-23.287-43.886c.563-6.414 3.565-11.411 6.711-11.167 3.139.236 5.233 5.629 4.677 12.028-.556 6.406-3.565 11.412-6.704 11.168-3.146-.237-5.24-5.622-4.684-12.029m-11.671 43.947c1.066 6.354-.602 11.861-3.725 12.31-3.116.449-6.506-4.327-7.564-10.68-1.059-6.354.601-11.868 3.732-12.318 3.116-.456 6.49 4.335 7.557 10.688m-19.037-84.991c.61-6.407 3.649-11.389 6.795-11.137 3.131.259 5.195 5.659 4.602 12.066-.61 6.399-3.649 11.381-6.795 11.13-3.139-.259-5.195-5.661-4.602-12.059m298.184 307.279c-.19 6.795-5.751 12.203-12.554 12.203H36.268c-6.917-.015-12.531-5.622-12.547-12.546v-40.359h461.685zm2.133-77.017H23.874c-.053-.007-.099-.03-.152-.037v-56.388h464.26zm2.05-72.026H24.552l-.662-.747c-.053-.068-.115-.228-.168-.312v-15.434l-.038-.472a85 85 0 0 1-.274-7.214c-.016-13.247 2.574-31.019 8.997-50.848 6.414-19.845 16.629-41.799 31.758-63.807 13.301-19.38 32.254-34.821 51.459-45.219 9.59-5.203 19.219-9.149 28.086-11.754 8.86-2.613 16.988-3.855 23.31-3.848 6.041-.038 10.277 1.226 11.976 2.324l3.717 2.361c-18.816 16.271-35.217 44.77-35.217 86.082 0 55.876 45.989 68.91 71.988 68.91s71.988-13.034 71.988-68.91c0-6.239-.488-12.09-1.188-17.75l197.819 125.64.373.609.046.145zM177.266 170.856c-3.108.457-6.498-4.335-7.557-10.68-1.066-6.361.61-11.868 3.726-12.318 3.116-.457 6.506 4.326 7.572 10.68 1.051 6.36-.617 11.869-3.741 12.318" style={{ "fill": "#000" }} /></svg> },
        { name: "Croissant", icon: <svg className="size-6" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M40 2.047c-2.766 0-5.676 1.172-7.816 2.289a14.2 14.2 0 0 0-5.133.191c-1.149.262-2.301.711-3.219 1.528-.914.816-1.539 2.05-1.539 3.554v.97c-.152-.013-.363-.095-.508-.095-1.515 0-3.668.098-5.566 1.094-1.899.992-3.438 3.04-3.438 6.293v.66c-.32.004-.66-.043-.965.032-1.355.332-3.015.878-4.363 2.156C6.11 22 5.164 24.008 5.164 26.89v1.015c-.031.035-.059.024-.086.067-1.121 1.789-3.031 6.328-3.031 11.054 0 3.016.672 5.243 1.89 6.743 1.22 1.503 2.977 2.183 4.77 2.183 3.66 0 7.36-1.773 11.29-4.637 3.925-2.863 8.108-6.851 12.718-11.488C41.735 22.762 47.953 15.36 47.953 8c0-2.219-1.219-3.852-2.785-4.75-1.57-.902-3.461-1.203-5.168-1.203m0 1.906c1.469 0 3.078.3 4.219.953 1.136.649 1.828 1.516 1.828 3.094 0 6.242-5.73 13.484-14.688 22.484-4.586 4.614-8.722 8.543-12.488 11.29s-7.133 4.273-10.164 4.273c-1.34 0-2.437-.434-3.285-1.48-.852-1.044-1.469-2.81-1.469-5.54 0-3.953 1.672-8.035 2.563-9.609.234.027.511.07.898.145.941.175 2.223.453 3.555.687 1.336.234 2.719.434 3.937.453 1.219.02 2.364-.015 3.153-.93.402-.468.39-1.257.148-1.71s-.594-.762-1.012-1.067c-.836-.61-1.996-1.14-3.328-1.543-2.023-.61-4.453-.937-6.515-.262.265-1.363.722-2.425 1.418-3.086.968-.921 2.277-1.39 3.5-1.687.421-.102 1.539.012 2.847.36 1.309.343 2.844.859 4.363 1.331 1.516.47 3.016.895 4.356 1.043.668.075 1.305.086 1.91-.047.602-.132 1.203-.433 1.61-.964.417-.543.449-1.328.218-1.899-.23-.57-.625-1.023-1.117-1.46-.977-.868-2.375-1.645-3.953-2.239-1.574-.594-3.324-.988-4.996-.98a7.8 7.8 0 0 0-2.383.37c.402-1.253 1.031-2.167 1.98-2.667 1.395-.73 3.266-.875 4.68-.875.508 0 1.633.238 2.895.582 1.261.347 2.699.793 4.07 1.16 1.367.367 2.645.668 3.734.695.543.012 1.055-.023 1.563-.293s.91-.926.91-1.535c0-1.125-.672-2.059-1.535-2.738-.867-.684-1.969-1.184-3.176-1.54-1.894-.558-3.957-.609-5.824-.253.152-.387.375-.715.683-.992.567-.504 1.422-.872 2.372-1.09 1.898-.438 4.195-.25 4.695-.153l.328.063.3-.156c1.99-1.059 4.915-2.188 7.2-2.188M26.434 10.07c1.082.016 2.242.18 3.273.48 1.031.305 1.941.747 2.531 1.212.528.414.684.777.727 1.11-.098.023-.176.054-.434.046-.746-.02-1.968-.273-3.289-.629-1.32-.355-2.75-.797-4.055-1.156-.824-.227-1.457-.293-2.144-.41l.566-.23c.73-.298 1.739-.438 2.825-.423m-8.914 7.403c1.351-.008 2.914.332 4.316.855 1.402.527 2.644 1.25 3.352 1.879.355.316.558.613.613.746.02.043.023.031.027.035-.078.102-.2.188-.488.25-.3.067-.75.078-1.293.016-1.086-.117-2.516-.512-4.004-.973-1.488-.457-3.035-.98-4.441-1.351-.457-.121-.868-.192-1.29-.274l.114-.125c.668-.703 1.746-1.05 3.094-1.058M9.672 26.77c1.183-.036 2.476.16 3.64.511 1.168.352 2.192.848 2.762 1.262.04.027.028.031.063.059-.25.082-.465.203-1.2.195-1.027-.016-2.347-.2-3.636-.426-1.285-.23-2.551-.5-3.535-.683-.336-.067-.594-.102-.868-.141.707-.485 1.676-.742 2.774-.777" /></svg> },
        { name: "Bagel", icon: <svg className="size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path fillRule="evenodd" clipRule="evenodd" d="M2.924 10.207a9.3 9.3 0 0 0-.15 2.466l.066.054c.22.176.53.41.892.643.757.488 1.6.88 2.268.88.436 0 .964-.169 1.518-.448.337-.17.659-.367.943-.56a3.75 3.75 0 1 1 6.658.841c.222.107.452.167.686.167.463 0 .682-.22 1.117-.734l.032-.038c.361-.428.889-1.054 1.826-1.198a.75.75 0 0 1-.276-1.28l1.678-1.478a.75.75 0 0 1 .686-.163 9.2 9.2 0 0 0-.977-2.189l-.36.36a.75.75 0 1 1-1.061-1.06l.524-.524A9.23 9.23 0 0 0 12 2.75c-1.77 0-3.424.497-4.83 1.36l.36.36a.75.75 0 0 1-1.06 1.06l-.524-.524a9.3 9.3 0 0 0-2.377 3.182.75.75 0 0 1 .784.708l.079 1.412a.75.75 0 1 1-1.498.083zm18.23.458-1.659 1.46a.8.8 0 0 1-.2.127c.757.029 1.398.347 1.904.728a9.4 9.4 0 0 0-.045-2.315m-.303 4.032c-.442-.499-1.032-.947-1.667-.947-.463 0-.681.22-1.116.734l-.032.038c-.41.487-1.036 1.228-2.23 1.228-.708 0-1.316-.257-1.803-.58-.58.367-1.266.58-2.003.58a3.74 3.74 0 0 1-2.767-1.22c-.31.208-.664.423-1.04.612-.642.323-1.417.608-2.193.608-1.013 0-2.047-.488-2.82-.957a9.254 9.254 0 0 0 17.67-.096M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12m9.22-8.53a.75.75 0 0 1 1.06 0l1 1a.75.75 0 0 1-1.06 1.06l-1-1a.75.75 0 0 1 0-1.06m5.98.93a.75.75 0 0 1 .15 1.05l-1.5 2a.75.75 0 1 1-1.2-.9l1.5-2a.75.75 0 0 1 1.05-.15m-5.226 2.406a.75.75 0 0 1-.53.918l-1.366.366a.75.75 0 1 1-.388-1.448l1.366-.366a.75.75 0 0 1 .918.53m-5.327.368a.75.75 0 0 1 .993.372l.585 1.287a.75.75 0 0 1-1.365.621l-.586-1.287a.75.75 0 0 1 .373-.993m10.718 1.053a.75.75 0 0 1 .784.714l.066 1.413a.75.75 0 1 1-1.498.07l-.066-1.412a.75.75 0 0 1 .714-.785M12 9.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5m-5.057 1.145a.75.75 0 0 1 .162 1.048l-.835 1.141a.75.75 0 1 1-1.21-.886l.835-1.14a.75.75 0 0 1 1.048-.163" fill="#1c274c" /></svg> },
        { name: "Bread", icon: <svg className="size-6" height="200" width="200" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000"><g id="SVGRepo_bgCarrier" strokeWidth="0" /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path className="st0" d="M512 159.234c0-2.486-.099-5.013-.264-7.572-1.338-19.604-9.365-38.366-22.279-54.682-19.471-24.542-49.628-44.335-88.802-58.389C361.433 24.586 312.961 16.411 256 16.404c-75.952.04-136.811 14.475-180.774 38.116-21.948 11.858-39.735 26.085-52.683 42.46C9.613 113.296 1.585 132.058.265 151.653A107 107 0 0 0 0 159.234c0 .924.116 1.792.133 2.708-.05 1.297-.133 2.617-.133 3.898-.033 13.757 2.857 26.382 8.291 37.126 4.046 8.06 9.447 14.979 15.574 20.619 9.232 8.472 19.934 14.104 30.718 17.762 4.013 1.355 8.059 2.379 12.089 3.237v229.874c0 5.566 2.246 11.015 6.193 14.945 3.931 3.94 9.381 6.194 14.946 6.194h336.378c5.566 0 10.999-2.254 14.946-6.194 3.931-3.93 6.193-9.38 6.193-14.945V244.633c2.824-.603 5.648-1.289 8.473-2.131 14.385-4.302 28.95-11.982 40.181-24.979 5.582-6.465 10.206-14.21 13.311-22.956 3.105-8.736 4.706-18.406 4.706-28.728 0-1.123-.083-2.287-.132-3.427.034-1.064.133-2.105.133-3.178m-53.476 25.648c-1.717 3.468-3.864 6.284-6.54 8.811-3.98 3.757-9.299 6.829-15.607 9.009-6.293 2.188-13.477 3.427-20.463 3.724-11.28.504-20.197 9.835-20.197 21.123v232.532h-294.1V227.548c0-11.288-8.918-20.619-20.198-21.123-6.209-.264-12.584-1.272-18.331-3.03-8.704-2.651-15.657-6.87-20.248-12.337-2.329-2.766-4.195-5.904-5.599-9.9-1.123-3.262-1.915-7.167-2.18-11.882l.05-1.182c.678-9.587 4.608-19.718 13.146-30.346 12.7-15.871 36.068-32.047 69.842-43.814 33.724-11.817 77.621-19.339 130.568-19.331 70.586-.05 125.086 13.443 160.857 32.394 17.902 9.438 31.048 20.181 39.553 30.751 8.522 10.628 12.453 20.76 13.146 30.338l.016.694c-.329 6.861-1.733 12.039-3.715 16.102" /><path className="st0" d="M225.002 211.587a10.56 10.56 0 0 0-10.57 10.57c0 5.846 4.723 10.57 10.57 10.57a10.56 10.56 0 0 0 10.57-10.57 10.56 10.56 0 0 0-10.57-10.57m110.981 71.873c0-8.762-7.101-15.854-15.854-15.854-8.77 0-15.855 7.093-15.855 15.854 0 8.752 7.085 15.854 15.855 15.854 8.753.001 15.854-7.101 15.854-15.854m-161.716 23.253c-7.002 0-12.684 5.68-12.684 12.684 0 7.002 5.682 12.684 12.684 12.684s12.684-5.682 12.684-12.684c0-7.003-5.681-12.684-12.684-12.684m175.456-150.088a10.564 10.564 0 0 0-10.57 10.57c0 5.838 4.723 10.57 10.57 10.57 5.83 0 10.57-4.732 10.57-10.57 0-5.839-4.74-10.57-10.57-10.57m-103.582-46.507c0-5.838-4.74-10.57-10.57-10.57a10.564 10.564 0 0 0-10.57 10.57c0 5.838 4.723 10.57 10.57 10.57 5.83 0 10.57-4.732 10.57-10.57" /><circle className="st0" cx="123.533" cy="158.739" r="6.342" /><circle className="st0" cx="157.356" cy="416.638" r="6.342" /><path className="st0" d="M340.21 391.006c-6.572 0-11.89 5.326-11.89 11.891 0 6.564 5.318 11.89 11.89 11.89 6.557 0 11.891-5.326 11.891-11.89.001-6.565-5.334-11.891-11.891-11.891m-92.534-9.487c-5.384 0-9.76 4.368-9.76 9.752s4.376 9.752 9.76 9.752 9.744-4.368 9.744-9.752c.001-5.384-4.359-9.752-9.744-9.752" /></g></svg> },
    ];

// const products: Product[] = [
//     {
//         id: 1,
//         name: "Chocolate Chip Cookies",
//         category: "Cookies",
//         price: 120,
//         description: "Classic, chunky and loaded with chocolate.",
//         tags: ["Classic", "Crunchy", "Buttery"],
//         image:
//             "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=85&w=1000&auto=format&fit=crop",
//         accent: "#FFE45E",
//         note: "CLASSIC FAVOURITE",

//         rating: 4.8,
//         reviewCount: 124,

//         ingredients: [
//             "Dark chocolate",
//             "Wheat flour",
//             "Brown sugar",
//             "Butter",
//             "Free-range eggs",
//             "Vanilla",
//             "Sea salt",
//         ],

//         reviews: [
//             {
//                 id: 1,
//                 name: "Aarav",
//                 rating: 5,
//                 text: "The chocolate chunks are ridiculously good.",
//                 date: "2 days ago",
//             },
//             {
//                 id: 2,
//                 name: "Meera",
//                 rating: 5,
//                 text: "Soft in the middle and crispy around the edges.",
//                 date: "1 week ago",
//             },
//             {
//                 id: 3,
//                 name: "Rohan",
//                 rating: 4,
//                 text: "Really good cookie. Would order again.",
//                 date: "2 weeks ago",
//             },
//         ],
//     },
//     {
//         id: 2,
//         name: "Bagel With Seeds",
//         category: "Bagel",
//         price: 150,
//         description: "Freshly baked with a golden, chewy crust.",
//         tags: ["Fresh", "Chewy", "Hearty"],
//         image:
//             "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=85&w=1000&auto=format&fit=crop",
//         accent: "#8FD7E8",
//         note: "FRESHLY BAKED",

//         rating: 4.8,
//         reviewCount: 124,

//         ingredients: [
//             "Dark chocolate",
//             "Wheat flour",
//             "Brown sugar",
//             "Butter",
//             "Free-range eggs",
//             "Vanilla",
//             "Sea salt",
//         ],

//         reviews: [
//             {
//                 id: 1,
//                 name: "Aarav",
//                 rating: 5,
//                 text: "The chocolate chunks are ridiculously good.",
//                 date: "2 days ago",
//             },
//             {
//                 id: 2,
//                 name: "Meera",
//                 rating: 5,
//                 text: "Soft in the middle and crispy around the edges.",
//                 date: "1 week ago",
//             },
//             {
//                 id: 3,
//                 name: "Rohan",
//                 rating: 4,
//                 text: "Really good cookie. Would order again.",
//                 date: "2 weeks ago",
//             },
//         ],
//     },
//     {
//         id: 3,
//         name: "Sliced Piece Bread",
//         category: "Bread",
//         price: 80,
//         description: "Soft everyday bread baked from scratch.",
//         tags: ["Soft", "Fresh", "Everyday"],
//         image:
//             "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=85&w=1000&auto=format&fit=crop",
//         accent: "#FFA16D",
//         note: "SO SOFT",

//         rating: 4.8,
//         reviewCount: 124,

//         ingredients: [
//             "Dark chocolate",
//             "Wheat flour",
//             "Brown sugar",
//             "Butter",
//             "Free-range eggs",
//             "Vanilla",
//             "Sea salt",
//         ],

//         reviews: [
//             {
//                 id: 1,
//                 name: "Aarav",
//                 rating: 5,
//                 text: "The chocolate chunks are ridiculously good.",
//                 date: "2 days ago",
//             },
//             {
//                 id: 2,
//                 name: "Meera",
//                 rating: 5,
//                 text: "Soft in the middle and crispy around the edges.",
//                 date: "1 week ago",
//             },
//             {
//                 id: 3,
//                 name: "Rohan",
//                 rating: 4,
//                 text: "Really good cookie. Would order again.",
//                 date: "2 weeks ago",
//             },
//         ],
//     },
//     {
//         id: 4,
//         name: "Nutty Biscuits",
//         category: "Cookies",
//         price: 140,
//         description: "Golden biscuits packed with roasted nuts.",
//         tags: ["Almond", "Crunchy", "Wholesome"],
//         image:
//             "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=85&w=1000&auto=format&fit=crop",
//         accent: "#B8D8A8",
//         note: "NUTS IN EVERY BITE",

//         rating: 4.8,
//         reviewCount: 124,

//         ingredients: [
//             "Dark chocolate",
//             "Wheat flour",
//             "Brown sugar",
//             "Butter",
//             "Free-range eggs",
//             "Vanilla",
//             "Sea salt",
//         ],

//         reviews: [
//             {
//                 id: 1,
//                 name: "Aarav",
//                 rating: 5,
//                 text: "The chocolate chunks are ridiculously good.",
//                 date: "2 days ago",
//             },
//             {
//                 id: 2,
//                 name: "Meera",
//                 rating: 5,
//                 text: "Soft in the middle and crispy around the edges.",
//                 date: "1 week ago",
//             },
//             {
//                 id: 3,
//                 name: "Rohan",
//                 rating: 4,
//                 text: "Really good cookie. Would order again.",
//                 date: "2 weeks ago",
//             },
//         ],
//     },
//     {
//         id: 5,
//         name: "Classic Croissant",
//         category: "Croissant",
//         price: 160,
//         description: "Flaky layers with a rich buttery center.",
//         tags: ["Classic", "Buttery", "Flaky"],
//         image:
//             "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=85&w=1000&auto=format&fit=crop",
//         accent: "#9EDFF0",
//         note: "BUTTERY & FLAKY",

//         rating: 4.8,
//         reviewCount: 124,

//         ingredients: [
//             "Dark chocolate",
//             "Wheat flour",
//             "Brown sugar",
//             "Butter",
//             "Free-range eggs",
//             "Vanilla",
//             "Sea salt",
//         ],

//         reviews: [
//             {
//                 id: 1,
//                 name: "Aarav",
//                 rating: 5,
//                 text: "The chocolate chunks are ridiculously good.",
//                 date: "2 days ago",
//             },
//             {
//                 id: 2,
//                 name: "Meera",
//                 rating: 5,
//                 text: "Soft in the middle and crispy around the edges.",
//                 date: "1 week ago",
//             },
//             {
//                 id: 3,
//                 name: "Rohan",
//                 rating: 4,
//                 text: "Really good cookie. Would order again.",
//                 date: "2 weeks ago",
//             },
//         ],
//     },
//     {
//         id: 6,
//         name: "Blueberry Cake",
//         category: "Cake",
//         price: 180,
//         description: "Moist vanilla cake filled with real berries.",
//         tags: ["Fruity", "Moist", "Delicious"],
//         image:
//             "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=85&w=1000&auto=format&fit=crop",
//         accent: "#D5B8F5",
//         note: "REAL BERRIES",

//         rating: 4.8,
//         reviewCount: 124,

//         ingredients: [
//             "Dark chocolate",
//             "Wheat flour",
//             "Brown sugar",
//             "Butter",
//             "Free-range eggs",
//             "Vanilla",
//             "Sea salt",
//         ],

//         reviews: [
//             {
//                 id: 1,
//                 name: "Aarav",
//                 rating: 5,
//                 text: "The chocolate chunks are ridiculously good.",
//                 date: "2 days ago",
//             },
//             {
//                 id: 2,
//                 name: "Meera",
//                 rating: 5,
//                 text: "Soft in the middle and crispy around the edges.",
//                 date: "1 week ago",
//             },
//             {
//                 id: 3,
//                 name: "Rohan",
//                 rating: 4,
//                 text: "Really good cookie. Would order again.",
//                 date: "2 weeks ago",
//             },
//         ],
//     },
//     {
//         id: 7,
//         name: "Sea Salt Pretzel",
//         category: "Pastries",
//         price: 130,
//         description: "Golden, chewy and finished with sea salt.",
//         tags: ["Classic", "Chewy", "Salty"],
//         image:
//             "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?q=85&w=1000&auto=format&fit=crop",
//         accent: "#92DCE5",
//         note: "SALTY & SOFT",

//         rating: 4.8,
//         reviewCount: 124,

//         ingredients: [
//             "Dark chocolate",
//             "Wheat flour",
//             "Brown sugar",
//             "Butter",
//             "Free-range eggs",
//             "Vanilla",
//             "Sea salt",
//         ],

//         reviews: [
//             {
//                 id: 1,
//                 name: "Aarav",
//                 rating: 5,
//                 text: "The chocolate chunks are ridiculously good.",
//                 date: "2 days ago",
//             },
//             {
//                 id: 2,
//                 name: "Meera",
//                 rating: 5,
//                 text: "Soft in the middle and crispy around the edges.",
//                 date: "1 week ago",
//             },
//             {
//                 id: 3,
//                 name: "Rohan",
//                 rating: 4,
//                 text: "Really good cookie. Would order again.",
//                 date: "2 weeks ago",
//             },
//         ],
//     },
//     {
//         id: 8,
//         name: "Cinnamon Roll",
//         category: "Pastries",
//         price: 170,
//         description: "Warm cinnamon, soft dough and sweet icing.",
//         tags: ["Cinnamon", "Soft", "Creamy"],
//         image:
//             "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=85&w=1000&auto=format&fit=crop",
//         accent: "#FFB08B",
//         note: "SWEET & WARM",

//         rating: 4.8,
//         reviewCount: 124,

//         ingredients: [
//             "Dark chocolate",
//             "Wheat flour",
//             "Brown sugar",
//             "Butter",
//             "Free-range eggs",
//             "Vanilla",
//             "Sea salt",
//         ],

//         reviews: [
//             {
//                 id: 1,
//                 name: "Aarav",
//                 rating: 5,
//                 text: "The chocolate chunks are ridiculously good.",
//                 date: "2 days ago",
//             },
//             {
//                 id: 2,
//                 name: "Meera",
//                 rating: 5,
//                 text: "Soft in the middle and crispy around the edges.",
//                 date: "1 week ago",
//             },
//             {
//                 id: 3,
//                 name: "Rohan",
//                 rating: 4,
//                 text: "Really good cookie. Would order again.",
//                 date: "2 weeks ago",
//             },
//         ],
//     },
// ];

/* -------------------------------------------------------------------------- */
/* ANIMATION                                                                  */
/* -------------------------------------------------------------------------- */

const fadeUp = {
    hidden: {
        opacity: 0,
        y: 18,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
    },
};

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

type Sort = "popular" | "price-low" | "price-high" | "name";

const EASE = [0.22, 1, 0.36, 1] as const;

const TICKER = [
    "Baked fresh every morning",
    <Star size={16} className="animate-spin" />,
    "Made by hand, never by machine",
    <Star size={16} className="animate-spin" />,
    "Good things take time",
    <Star size={16} className="animate-spin" />,
    "Treat yourself",
    <Star size={16} className="animate-spin" />,
];



export default function ProductsPage() {
    const reduce = useReducedMotion();
    
     const [activeCategory, setActiveCategory] =
         useState<Category>("All");

    const {  products, cart, setCartItem, toggleShowCart } = useAuthStore();

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<Sort>("popular");
    const [favorites, setFavorites] = useState<number[]>([]);
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    // const [cartCount, setCartCount] = useState(0);
    const [addedProduct, setAddedProduct] =
        useState<number | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [quickView, setQuickView] =
        useState<Product | null>(null);

    const timers = useRef<number[]>([]);
    const shopRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const list = timers.current;
        return () => list.forEach((t) => window.clearTimeout(t));
    }, []);

    function filter_Products(){
        let result = [...products];

        if (activeCategory !== "All") {
            result = result.filter(
                (p) => p.category === activeCategory
            );
        }

        if (onlyFavorites) {
            result = result.filter((p) =>
                favorites.includes(p._id)
            );
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.tags.some((t) =>
                        t.toLowerCase().includes(q)
                    )
            );
        }

        switch (sort) {
            case "price-low":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name":
                result.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                break;
        }

        return result;
    }
    const filteredProducts = useMemo(() => {
        return filter_Products();
    }, [activeCategory, search, sort, onlyFavorites, favorites,products]);

    const hasFilters =
        activeCategory !== "All" ||
        !!search.trim() ||
        onlyFavorites ||
        sort !== "popular";

    const toggleFavorite = (id: number) =>
        setFavorites((cur) =>
            cur.includes(id)
                ? cur.filter((i) => i !== id)
                : [...cur, id]
        );

    async function addToBag(id: number) {
        const data: cartItemType = {
            productId: id,
            quantity: 1,
        };

        const response = await cartAddBackend(data);
        
        if(response.success){
            setCartItem(response.data);
            setAddedProduct(id);
            setToast("Added to bag");
            timers.current.push(
                window.setTimeout(() => {
                    setToast(null);
                    setAddedProduct(null);
                }, 2000)
            );
        }else{
            setToast(response.message || "Failed to add to bag");
            timers.current.push(
                window.setTimeout(() => setToast(null), 2000)
            );

        }
    };
    const showToast = (message: string, duration = 2000) => {
    setToast(message);

    timers.current.push(
        window.setTimeout(() => {
            setToast(null);
        }, duration)
    );
};

async function updateBag(id: number, quantity: number) {
    try {
        const response =
            quantity === 0
                ? await cartItemRemove(id)
                : await cartUpdateBackend(id, quantity);

        if (!response.success) {
            showToast(response.message || "Failed to update value");
            return;
        }

        setCartItem(response.data);
        showToast(quantity==0 ? "Item removed from bag" : "Bag updated");
        if(quantity != 0){
            setAddedProduct(id);
            timers.current.push(
                window.setTimeout(() => {
                    setAddedProduct(null);
                }, 2000)
            );
        }else{
            setAddedProduct(null);
        }

    } catch (error) {
        console.error("Failed to update bag:", error);
        showToast("Something went wrong");
    }
}



    const resetFilters = () => {
        setSearch("");
        setActiveCategory("All");
        setSort("popular");
        setOnlyFavorites(false);
    };

    const scrollToShop = () =>
        shopRef.current?.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "start",
        });

    return (
<main className="w-full overflow-x-hidden text-[#321714]">

    {/* ================= TICKER ================= */}
    <div
        aria-hidden="true"
        className="
            group relative mt-4 w-full
            -rotate-[0.6deg]
            overflow-hidden
            border-y-2 border-[#321714]
            bg-[#FFD91A]
            sm:mt-5
        "
    >
        <motion.div
            animate={reduce ? undefined : { x: ["0%", "-50%"] }}
            transition={{
                duration: 28,
                repeat: Infinity,
                ease: "linear",
            }}
            className="flex w-max"
        >
            {[0, 1, 2, 3].map((group) => (
                <div
                    key={group}
                    className="flex items-center"
                >
                    {TICKER.map((item, i) => (
                        <span
                            key={`${group}-${i}`}
                            className="
                                whitespace-nowrap
                                px-4 py-2.5
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.14em]
                                sm:px-6 sm:py-3.5
                                sm:text-[11px]
                                sm:tracking-[0.16em]
                            "
                        >
                            {item}
                        </span>
                    ))}
                </div>
            ))}
        </motion.div>
    </div>


    {/* ================= SHOP ================= */}
    <section
        ref={shopRef}
        className="
            mt-8
            px-4
            sm:mt-10 sm:px-6
            lg:px-8
            xl:px-10
        "
    >

        {/* ================= SHOP HEADER ================= */}
        <div
            className="
                mb-7
                flex flex-col
                gap-6
                sm:mb-9
                lg:flex-row
                lg:items-end
                lg:justify-between
            "
        >

            {/* Heading */}
            <div className="min-w-0">
                <h1
                    className="
                        font-title
                        text-[clamp(3.2rem,13vw,7.6rem)]
                        leading-[0.82]
                        tracking-[1px]
                    "
                >
                    ALL THE
                    <br />

                    <span className="relative inline-block">
                        GOOD STUFF

                        <svg
                            aria-hidden="true"
                            viewBox="0 0 300 20"
                            className="
                                absolute
                                -bottom-2
                                left-0
                                w-[70%]
                                sm:-bottom-4
                                sm:w-[72%]
                            "
                            fill="none"
                        >
                            <motion.path
                                d="M3 12C61 3 139 17 297 6"
                                stroke="#FFD91A"
                                strokeWidth="7"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                    delay: 0.6,
                                    duration: 0.9,
                                    ease: "easeOut",
                                }}
                            />
                        </svg>
                    </span>
                </h1>
            </div>


            {/* Hero Product */}
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.88,
                    rotate: 4,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                }}
                transition={{
                    duration: 0.9,
                    delay: 0.12,
                    ease: EASE,
                }}
                className="
                    relative
                    mx-auto
                    flex
                    w-full
                    max-w-[280px]
                    items-center
                    justify-center
                    sm:max-w-[340px]
                    lg:mx-0
                    lg:max-w-[360px]
                    xl:max-w-[400px]
                "
            >
                <motion.img
                    src="/product-hero.png"
                    alt="Fresh chocolate chip cookies"
                    className="
                        relative
                        z-10
                        w-full
                        cursor-pointer
                        drop-shadow-[0_25px_20px_rgba(50,23,20,0.18)]
                        sm:drop-shadow-[0_30px_25px_rgba(50,23,20,0.2)]
                    "
                    animate={
                        reduce
                            ? undefined
                            : {
                                  y: [0, -8, 0],
                                  rotate: [-1, 1, -1],
                              }
                    }
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    whileHover={{
                        scale: 1.05,
                        rotate: 3,
                    }}
                    whileTap={{
                        scale: 0.97,
                        rotate: -3,
                    }}
                />

                <motion.div
                    initial={{
                        opacity: 0,
                        rotate: 14,
                        scale: 0.8,
                    }}
                    animate={{
                        opacity: 1,
                        rotate: 9,
                        scale: 1,
                    }}
                    transition={{
                        delay: 0.55,
                        duration: 0.45,
                    }}
                    className="
                        absolute
                        -right-1
                        -top-3
                        z-20
                        font-text
                        text-[11px]
                        font-semibold
                        italic
                        leading-[1.15]
                        sm:-right-2
                        sm:-top-5
                        sm:text-[13px]
                    "
                >
                    cookies
                    <br />
                    make life
                    <br />
                    better ♡
                </motion.div>
            </motion.div>

        </div>


        {/* ================= MAIN CONTAINER ================= */}
        <div
            className="
                grid
                grid-cols-1
                gap-6
                lg:grid-cols-[170px_minmax(0,1fr)]
                lg:gap-8
                xl:grid-cols-[190px_minmax(0,1fr)]
            "
        >

            {/* ================= DESKTOP SIDEBAR ================= */}
            <aside className="hidden lg:block">
                <div className="sticky top-24 h-max">
                    <div className="space-y-1">
                        {categories.map((category) => (
                            <CategoryButton
                                key={category.name}
                                category={category}
                                active={
                                    activeCategory === category.name
                                }
                                onClick={() =>
                                    setActiveCategory(category.name)
                                }
                            />
                        ))}
                    </div>
                </div>
            </aside>


            {/* ================= PRODUCTS AREA ================= */}
            <div className="min-w-0">

                {/* ================= CONTROLS ================= */}
                <div
                    className="
                        sticky
                        top-20
                        z-40
                        h-max
                        bg-[var(--background)]
                        py-2
                        lg:top-22
                    "
                >

                    {/* MOBILE CATEGORY PILLS */}
                    <div
                        className="
                            -mx-1
                            mb-3
                            overflow-x-auto
                            px-1
                            pb-1
                            scrollbar-none
                            lg:hidden
                        "
                    >
                        <div className="flex w-max gap-2">
                            {categories.map((category) => (
                                <CategoryButton
                                    key={category.name}
                                    category={category}
                                    active={
                                        activeCategory ===
                                        category.name
                                    }
                                    onClick={() =>
                                        setActiveCategory(
                                            category.name
                                        )
                                    }
                                    mobile
                                />
                            ))}
                        </div>
                    </div>


                    {/* SEARCH + SORT + FAVORITES */}
                    <div
                        className="
                            flex
                            flex-col
                            gap-2.5
                            sm:flex-row
                            sm:items-center
                            sm:gap-3
                        "
                    >

                        {/* SEARCH */}
                        <div
                            className="
                                relative
                                w-full
                                sm:min-w-0
                                sm:flex-1
                                sm:max-w-[500px]
                            "
                        >
                            <Search
                                size={17}
                                strokeWidth={1.8}
                                className="
                                    pointer-events-none
                                    absolute left-3.5
                                    top-1/2
                                    -translate-y-1/2
                                    text-[#321714]/50
                                "
                            />

                            <input
                                type="search"
                                aria-label="Search treats"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search cookies, brownies, cakes…"
                                className="
                                    h-11
                                    w-full
                                    rounded-[14px]
                                    border
                                    border-[#321714]/10
                                    bg-[#FBF7F1]
                                    pl-10
                                    pr-10
                                    text-[12px]
                                    font-medium
                                    outline-none
                                    transition-all
                                    duration-300
                                    placeholder:text-[#321714]/40
                                    focus:border-[#321714]/30
                                    focus:bg-white
                                    focus:shadow-[0_8px_30px_rgba(50,23,20,0.08)]
                                    sm:h-12
                                    sm:text-[13px]
                                "
                            />

                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                    className="
                                        absolute
                                        right-2.5
                                        top-1/2
                                        flex
                                        h-7
                                        w-7
                                        -translate-y-1/2
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-[#321714]/50
                                        transition
                                        hover:bg-[#321714]/5
                                        hover:text-[#321714]
                                    "
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>


                        {/* SORT */}
                        <div
                            className="
                                relative
                                w-full
                                sm:w-[190px]
                                sm:shrink-0
                            "
                        >
                            <ArrowDownUp
                                size={14}
                                className="
                                    pointer-events-none
                                    absolute left-3.5
                                    top-1/2
                                    -translate-y-1/2
                                    text-[#321714]/50
                                "
                            />

                            <select
                                aria-label="Sort treats"
                                value={sort}
                                onChange={(e) =>
                                    setSort(
                                        e.target.value as Sort
                                    )
                                }
                                className="
                                    h-11
                                    w-full
                                    cursor-pointer
                                    appearance-none
                                    rounded-[14px]
                                    border
                                    border-[#321714]/10
                                    bg-[#FBF7F1]
                                    pl-9
                                    pr-9
                                    text-[11px]
                                    font-bold
                                    outline-none
                                    transition
                                    hover:bg-white
                                    focus:border-[#321714]/30
                                    sm:h-12
                                    sm:text-[12px]
                                "
                            >
                                <option value="popular">
                                    Most popular
                                </option>

                                <option value="price-low">
                                    Price: low to high
                                </option>

                                <option value="price-high">
                                    Price: high to low
                                </option>

                                <option value="name">
                                    Name: A to Z
                                </option>
                            </select>

                            <ChevronDown
                                size={13}
                                className="
                                    pointer-events-none
                                    absolute right-3.5
                                    top-1/2
                                    -translate-y-1/2
                                    text-[#321714]/50
                                "
                            />
                        </div>


                        {/* FAVORITES */}
                        <button
                            onClick={() =>
                                setOnlyFavorites((v) => !v)
                            }
                            aria-pressed={onlyFavorites}
                            className={`
                                flex
                                h-11
                                shrink-0
                                items-center
                                justify-center
                                gap-2
                                rounded-[14px]
                                border
                                px-3
                                text-[11px]
                                font-bold
                                transition
                                sm:px-4
                                ${
                                    onlyFavorites
                                        ? "border-[#321714] bg-[#321714] text-white"
                                        : "border-[#321714]/10 bg-[#FBF7F1] hover:bg-white"
                                }
                            `}
                        >
                            <Heart
                                size={14}
                                className={
                                    onlyFavorites
                                        ? "fill-[#FFD91A] text-[#FFD91A]"
                                        : ""
                                }
                            />

                            <span className="hidden sm:inline">
                                Favourites
                            </span>

                            <span
                                className="
                                    flex h-5 min-w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#FFD91A]
                                    px-1
                                    text-[10px]
                                    font-black
                                    text-[#321714]
                                "
                            >
                                {favorites.length}
                            </span>
                        </button>

                    </div>
                </div>


                {/* ================= PRODUCT GRID ================= */}
                <motion.div
                    layout
                    className="
                        grid
                        grid-cols-2
                        gap-x-3
                        gap-y-6
                        sm:gap-x-5
                        sm:gap-y-9
                        lg:grid-cols-2
                        xl:grid-cols-3
                    "
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map(
                            (product, index) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    index={index}
                                    cart={cart}
                                    updateBag={updateBag}
                                    isFavorite={favorites.includes(
                                        product._id
                                    )}
                                    isAdded={
                                        addedProduct ===
                                        product._id
                                    }
                                    onFavorite={() =>
                                        toggleFavorite(
                                            product._id
                                        )
                                    }
                                    onAdd={() =>
                                        addToBag(
                                            product._id
                                        )
                                    }
                                    onQuickView={() =>
                                        setQuickView(product)
                                    }
                                />
                            )
                        )}
                    </AnimatePresence>
                </motion.div>


                {/* ================= EMPTY STATE ================= */}
                {filteredProducts.length === 0 && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.98,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        className="
                            flex
                            min-h-[320px]
                            flex-col
                            items-center
                            justify-center
                            rounded-[24px]
                            border-2
                            border-dashed
                            border-[#321714]/15
                            bg-[#FBF7F1]
                            px-5
                            text-center
                            sm:min-h-[380px]
                            sm:rounded-[28px]
                            sm:px-6
                        "
                    >
                        <motion.div
                            animate={
                                reduce
                                    ? undefined
                                    : {
                                          rotate: [
                                              -8,
                                              8,
                                              -8,
                                          ],
                                      }
                            }
                            transition={{
                                duration: 2.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="
                                mb-4
                                text-5xl
                                sm:mb-5
                                sm:text-6xl
                            "
                        >
                            🍪
                        </motion.div>

                        <h3 className="font-title text-2xl sm:text-3xl">
                            {onlyFavorites &&
                            favorites.length === 0
                                ? "No favourites yet."
                                : "No treats match that."}
                        </h3>

                        <p
                            className="
                                mt-2
                                max-w-[280px]
                                text-[12px]
                                font-text
                                leading-5
                                text-[#321714]/60
                                sm:mt-3
                                sm:max-w-[300px]
                                sm:text-[13px]
                                sm:leading-6
                            "
                        >
                            {onlyFavorites &&
                            favorites.length === 0
                                ? "Tap the heart on any treat to save it here."
                                : "Try a different word, or clear your filters to see everything."}
                        </p>

                        <button
                            onClick={resetFilters}
                            className="
                                mt-5
                                rounded-[12px]
                                bg-[#FFD91A]
                                px-5
                                py-2.5
                                font-header
                                text-base
                                font-black
                                shadow-[2px_3px_0_#321714]
                                transition-all
                                hover:-translate-y-0.5
                                hover:shadow-[3px_5px_0_#321714]
                                focus-visible:outline
                                focus-visible:outline-2
                                focus-visible:outline-offset-2
                                focus-visible:outline-[#321714]
                                sm:mt-6
                                sm:px-6
                                sm:py-3
                                sm:text-xl
                            "
                        >
                            Show everything
                        </button>
                    </motion.div>
                )}

            </div>
        </div>
    </section>


    <div className="h-16 sm:h-24" />


    {/* ================= TOAST ================= */}
    <div
        aria-live="polite"
        className="
            pointer-events-none
            fixed
            inset-x-0
            bottom-4
            z-[60]
            flex
            justify-center
            px-3
            sm:bottom-7
            sm:px-4
        "
    >
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 24,
                        scale: 0.9,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                        y: 12,
                        scale: 0.95,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 28,
                    }}
                    className="
                        flex
                        max-w-[calc(100vw-24px)]
                        items-center
                        gap-2
                        rounded-full
                        bg-[#321714]
                        py-2
                        pl-2
                        pr-4
                        text-[11px]
                        font-bold
                        text-white
                        shadow-[0_12px_35px_rgba(50,23,20,0.25)]
                        sm:gap-2.5
                        sm:py-2.5
                        sm:pl-2.5
                        sm:pr-5
                        sm:text-[12px]
                    "
                >
                    <span
                        className="
                            flex
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#FFD91A]
                            text-[#321714]
                        "
                    >
                        <Check
                            size={14}
                            strokeWidth={3}
                        />
                    </span>

                    <span className="truncate">
                        {toast}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    </div>


    {/* ================= FLOATING BAG ================= */}
    <AnimatePresence>
        {(cart || []).length > 0 && (
            <motion.button
                onClick={() => toggleShowCart()}
                aria-label={`Open bag, ${cart.length} items`}
                initial={{
                    opacity: 0,
                    scale: 0.8,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: 20,
                }}
                whileHover={{
                    y: -3,
                }}
                whileTap={{
                    scale: 0.96,
                }}
                className="
                    fixed
                    bottom-4
                    right-4
                    z-50
                    flex
                    items-center
                    gap-2
                    rounded-[16px]
                    bg-[#321714]
                    px-3.5
                    py-3
                    text-white
                    shadow-[0_12px_35px_rgba(50,23,20,0.25)]
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-[#FFD91A]
                    sm:bottom-7
                    sm:right-7
                    sm:gap-3
                    sm:rounded-[18px]
                    sm:px-5
                    sm:py-3.5
                "
            >
                <ShoppingBag size={16} />

                <span className="text-[11px] font-black sm:text-[12px]">
                    Bag
                </span>

                <motion.span
                    key={cart.length}
                    initial={{
                        scale: 1.7,
                    }}
                    animate={{
                        scale: 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                    }}
                    className="
                        flex
                        h-6
                        min-w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FFD91A]
                        px-1.5
                        text-[10px]
                        font-black
                        text-[#321714]
                        sm:text-[11px]
                    "
                >
                    {cart.length}
                </motion.span>
            </motion.button>
        )}
    </AnimatePresence>


    {/* ================= QUICK VIEW ================= */}
    <AnimatePresence>
        {quickView && (
            <QuickView
                product={quickView}
                onClose={() => setQuickView(null)}
                onAdd={() => {
                    addToBag(quickView._id);
                    setQuickView(null);
                }}
            />
        )}
    </AnimatePresence>

</main>
    );
}

/* ==========================================================================
   CATEGORY BUTTON
============================================================================ */

function CategoryButton({
    category,
    active,
    onClick,
    mobile = false,
}: {
    category: { name: Category; icon: React.JSX.Element };
    active: boolean;
    onClick: () => void;
    mobile?: boolean;
}) {
    return (
        <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
            aria-pressed={active}
            className={`group relative flex items-center gap-3 whitespace-nowrap text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#321714] ${mobile
                ? "rounded-full border px-6 py-2.5"
                : "w-full rounded-[14px] px-5 py-3"
                } ${active
                    ? `bg-[#FFD91A] font-black ${mobile ? "border-[#321714]" : "border-transparent"
                    }`
                    : `font-semibold text-[#321714]/65 hover:bg-[#FBF7F1] hover:text-[#321714] ${mobile ? "border-[#321714]/10 bg-[#FBF7F1]" : ""
                    }`
                }`}
        >
            {category.icon}

            <span className="font-text font-medium text-sm">{category.name}</span>

            {active && !mobile && (
                <motion.span
                    layoutId="active-category-dot"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-[#321714]"
                />
            )}
        </motion.button>
    );
}

function ProductCard({
    product,
    index,
    isFavorite,
    isAdded,
    onFavorite,
    onAdd,
    onQuickView,
    updateBag,
    cart,
}: {
    product: Product;
    index: number;
    cart: cartItemType[];
    isFavorite: boolean;
    isAdded: boolean;
    onFavorite: () => void;
    onAdd: () => void;
    onQuickView: () => void;
    updateBag: (id: number, quantity: number) => void;
}) {
    const cartItem = (cart||[]).find(
        (item) => item.productId == product._id
    );

    const quantity = cartItem?.quantity || 0;

    return (
        <motion.article
            layout
            initial={{
                opacity: 0,
                y: 24,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: 12,
            }}
            transition={{
                duration: 0.55,
                delay: Math.min(index * 0.05, 0.3),
                ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
                y: -7,
            }}
            className="
                group relative cursor-pointer overflow-hidden
                rounded-[22px] border border-[#321714]/[0.055]
                bg-[#FCF9F3]
                shadow-[0_8px_30px_rgba(50,23,20,0.035)]
                transition-[box-shadow,transform]
                duration-500
                hover:shadow-[0_22px_55px_rgba(50,23,20,0.10)]
                sm:rounded-[26px]
                lg:rounded-[28px]
            "
        >
            {/* PRODUCT IMAGE */}
            <div
                onClick={onQuickView}
                className="
                    relative block w-full cursor-pointer
                    overflow-hidden rounded-t-[18px]
                    text-left
                    aspect-[1/0.72]
                    sm:aspect-[1/0.65]
                    lg:aspect-[1/0.6]
                "
                style={{
                    backgroundColor: product.accent,
                }}
            >
                <motion.img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/images/${product.image}`}
                    alt={product.name}
                    className="
                        h-full w-full object-cover
                        mix-blend-multiply
                        transition-transform duration-700
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        group-hover:scale-[1.07]
                    "
                />

                {/* EDITORIAL LABEL */}
                <SmallEditorialLabel tags={product.tags} />

                {/* FAVORITE */}
                <button
                    aria-label={
                        isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                    }
                    onClick={(e) => {
                        e.stopPropagation();
                        onFavorite();
                    }}
                    className={`
                        absolute right-2.5 top-2.5
                        flex h-8 w-8 items-center justify-center
                        rounded-full backdrop-blur-md
                        transition-all duration-300
                        sm:right-3 sm:top-3 sm:h-9 sm:w-9
                        ${
                            isFavorite
                                ? "bg-[#321714] text-white"
                                : "bg-[#FCF9F3]/85 text-[#321714] hover:bg-[#FCF9F3]"
                        }
                    `}
                >
                    <Heart
                        size={14}
                        strokeWidth={1.8}
                        fill={isFavorite ? "currentColor" : "none"}
                    />
                </button>

                {/* PLAYFUL DETAIL */}
                <span
                    className="
                        pointer-events-none absolute
                        bottom-2.5 left-2.5
                        rotate-[-8deg]
                        font-[cursive]
                        text-base
                        text-[#321714]/70
                        sm:bottom-3 sm:left-3 sm:text-[19px]
                    "
                >
                    {index % 3 === 0
                        ? "✦"
                        : index % 3 === 1
                            ? "♡"
                            : "⌁"}
                </span>

                {/* HOVER VIEW */}
                <span
                    className="
                        pointer-events-none absolute
                        bottom-2.5 right-2.5
                        flex items-center gap-1
                        rounded-full bg-[#321714]
                        px-2.5 py-1.5
                        font-header text-[7px]
                        uppercase tracking-[0.12em]
                        text-white
                        opacity-0
                        translate-y-2
                        transition duration-300
                        group-hover:translate-y-0
                        group-hover:opacity-100
                        sm:bottom-3 sm:right-3
                        sm:px-3.5 sm:py-2 sm:text-[8px]
                    "
                >
                    View
                    <ChevronRight size={13} />
                </span>
            </div>

            {/* CONTENT */}
            <div className="px-3.5 pb-3.5 pt-4 sm:px-5 sm:pb-4 sm:pt-5">

                {/* PRODUCT NAME */}
                <div className="min-w-0">
                    <h3
                        className="
                            truncate
                            font-header
                            text-lg
                            leading-[1.05]
                            tracking-[-0.4px]
                            text-[#321714]
                            sm:text-xl
                            lg:text-2xl
                        "
                    >
                        {product.name}
                    </h3>
                </div>

                {/* BOTTOM */}
                <div className="mt-3 flex items-center justify-between gap-2 sm:mt-2 sm:gap-3">

                    {/* PRICE */}
                    <div className="min-w-0">
                        <span
                            className="
                                block
                                font-header
                                text-xl
                                leading-none
                                tracking-[-0.5px]
                                text-[#321714]
                                sm:text-2xl
                            "
                        >
                            ₹{product.price}
                        </span>
                    </div>

                    {/* CART CONTROLS */}
                    {cartItem ? (
                        <div
                            className="
                                inline-flex h-9 shrink-0
                                items-center overflow-hidden
                                rounded-[10px]
                                border border-[#321714]/10
                                bg-[#FCF9F3]
                                shadow-[0_3px_12px_rgba(50,23,20,0.06)]
                                sm:h-10 sm:rounded-[12px]
                            "
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    updateBag(
                                        product._id,
                                        quantity - 1
                                    )
                                }
                                className="
                                    flex h-full w-8
                                    items-center justify-center
                                    text-[#321714]/55
                                    transition-all duration-200
                                    hover:bg-[#FFD91A]/20
                                    hover:text-[#321714]
                                    active:scale-90
                                    sm:w-9
                                "
                            >
                                <Minus
                                    className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                                    strokeWidth={2.2}
                                />
                            </button>

                            <span
                                className="
                                    flex min-w-7
                                    items-center justify-center
                                    text-xs font-semibold
                                    tabular-nums
                                    text-[#321714]
                                    sm:min-w-8 sm:text-[13px]
                                "
                            >
                                {quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    updateBag(
                                        product._id,
                                        quantity + 1
                                    )
                                }
                                className="
                                    flex h-full w-8
                                    items-center justify-center
                                    text-[#321714]/55
                                    transition-all duration-200
                                    hover:bg-[#FFD91A]/50
                                    hover:text-[#321714]
                                    active:scale-90
                                    sm:w-9
                                "
                            >
                                <Plus
                                    className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                                    strokeWidth={2.2}
                                />
                            </button>
                        </div>
                    ) : (
                        <motion.button
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={onAdd}
                            className={`
                                relative
                                flex h-9 shrink-0
                                min-w-0
                                items-center justify-center
                                gap-1
                                rounded-[10px]
                                px-3
                                font-header
                                text-[10px]
                                uppercase
                                tracking-[0.07em]
                                transition-all duration-300
                                sm:h-10
                                sm:min-w-[108px]
                                sm:gap-1.5
                                sm:rounded-[13px]
                                sm:px-4
                                sm:text-sm
                                sm:tracking-[0.08em]
                                ${
                                    isAdded
                                        ? "bg-[#3D8B5B] text-white"
                                        : "bg-[#FFD91A] text-[#321714] hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#321714]"
                                }
                            `}
                        >
                            <AnimatePresence mode="wait">
                                {isAdded ? (
                                    <motion.span
                                        key="added"
                                        initial={{
                                            opacity: 0,
                                            y: 5,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -5,
                                        }}
                                        className="flex items-center gap-1"
                                    >
                                        <Check
                                            size={11}
                                            strokeWidth={3}
                                        />
                                        Added
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="add"
                                        initial={{
                                            opacity: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                        }}
                                        className="flex items-center gap-1"
                                    >
                                        Add
                                        <Plus
                                            size={11}
                                            strokeWidth={3}
                                        />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.article>
    );
}



function SmallEditorialLabel({ tags }: { tags: string[] }) {
    if (!tags || tags.length === 0) return null;

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % tags.length);
        }, 2200);

        return () => clearInterval(interval);
    }, [tags.length]);

    return (
        <span
            className="
                absolute
                left-3
                top-3
                z-20
                flex
                h-7
                items-center
                overflow-hidden
                rounded-full
                bg-[#FCF9F3]/85
                px-3
                backdrop-blur-md
                shadow-[0_4px_14px_rgba(50,23,20,0.07)]
            "
        >
            {/* Text viewport */}
            <span className="relative flex h-full items-center overflow-hidden">
                <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                        key={tags[index]}
                        initial={{
                            y: "100%",
                            opacity: 0,
                        }}
                        animate={{
                            y: "0%",
                            opacity: 1,
                        }}
                        exit={{
                            y: "-100%",
                            opacity: 0,
                        }}
                        transition={{
                            y: {
                                duration: 0.55,
                                ease: [0.22, 1, 0.36, 1],
                            },
                            opacity: {
                                duration: 0.3,
                                ease: "easeOut",
                            },
                        }}
                        className="
                            whitespace-nowrap
                            text-[8px]
                            font-text
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-[#321714]/70
                        "
                    >
                        {tags[index]}
                    </motion.span>
                </AnimatePresence>
            </span>
        </span>
    );
}


