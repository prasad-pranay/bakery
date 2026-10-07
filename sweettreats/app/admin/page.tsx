"use client";

import { useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  CircleCheck,
  Clock3,
  MoreHorizontal,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import AdminHeader from "./sidebar";
import Link from "next/link";

import {Category} from "../type/product";


const categories: {
    name: Category;
    icon: React.JSX.Element;
}[] = [
        { name: "Cookies", icon: <svg className="size-6" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" ><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M59.896 23.918c-.245-.771-.443-1.315-.476-1.514a5 5 0 0 1-1.29.156c-.775 0-1.67-.15-2.594-.525-2.065-.838-3.416-2.459-3.786-4.514-.233.066-.546.1-.909.1-1.17 0-2.865-.353-4.116-1.137-2.388-1.496-2.862-5.666-2.862-5.666-2.705-.783-4.739-3.965-4.414-6.672C37.024 3.494 34.628 2 31.999 2c-2.633 0-5.033 1.502-7.461 2.15-2.514.672-5.342.592-7.54 1.863-2.232 1.293-3.568 3.793-5.379 5.604-1.813 1.813-4.313 3.148-5.604 5.379-1.273 2.201-1.191 5.027-1.863 7.541C3.504 26.965 2 29.368 2 31.999c0 2.632 1.504 5.033 2.152 7.462.672 2.512.59 5.34 1.863 7.539 1.291 2.232 3.791 3.568 5.604 5.379 1.811 1.811 3.146 4.313 5.379 5.604 2.198 1.275 5.026 1.193 7.54 1.865 2.428.65 4.828 2.152 7.461 2.152 2.635 0 5.035-1.502 7.465-2.152 2.512-.672 5.34-.59 7.538-1.865 2.232-1.291 3.568-3.793 5.379-5.604 1.813-1.811 4.313-3.146 5.604-5.379 1.273-2.199 1.191-5.027 1.863-7.539.648-2.43 2.152-4.83 2.152-7.462s-2.104-8.081-2.104-8.081m-1.025 7.426c-.124.816-.739 1.691-1.393 2.617-.711 1.01-1.518 2.156-1.883 3.527-.248.926-.39 1.85-.527 2.744-.215 1.395-.417 2.711-.979 3.684-.575.992-1.619 1.826-2.724 2.709-.702.561-1.428 1.139-2.097 1.809-.669.668-1.249 1.395-1.81 2.098-.883 1.104-1.716 2.146-2.71 2.723-.971.563-2.286.766-3.679.979-.895.139-1.82.281-2.745.529-.892.238-1.741.57-2.563.895-1.324.52-2.575 1.01-3.763 1.01s-2.438-.492-3.763-1.012c-.82-.322-1.669-.654-2.559-.893-.927-.248-1.853-.391-2.747-.529-1.394-.213-2.709-.416-3.682-.979-.993-.574-1.826-1.619-2.707-2.723-.562-.703-1.142-1.43-1.811-2.098-.669-.67-1.395-1.248-2.097-1.809-1.104-.883-2.148-1.717-2.723-2.709-.563-.973-.766-2.289-.98-3.684-.138-.895-.279-1.818-.526-2.742-.238-.895-.573-1.746-.896-2.57C6.99 33.598 6.5 32.35 6.5 31.167c0-1.186.49-2.436 1.01-3.758.323-.823.657-1.674.896-2.566.247-.926.389-1.85.526-2.745.215-1.394.417-2.711.979-3.684.575-.993 1.619-1.826 2.724-2.708.702-.561 1.428-1.14 2.097-1.809s1.249-1.395 1.811-2.097c.882-1.104 1.715-2.147 2.706-2.722.973-.563 2.289-.765 3.683-.98.895-.138 1.82-.28 2.745-.528.892-.238 1.742-.571 2.563-.894 1.324-.519 2.574-1.009 3.76-1.009q.513 0 1.047-.005.536-.004 1.085-.005c1.136 0 2.301.023 3.36.153.388 2.682 2.187 5.234 4.596 6.449.369 1.652 1.312 4.502 3.575 5.92 1.488.933 3.28 1.339 4.637 1.425.824 1.919 2.393 3.436 4.484 4.285a9 9 0 0 0 3.217.671c.511 1.626 1.238 4.358.87 6.784M48.731 9.453l1.375 1.375-1.375 1.375-1.375-1.375zm6.42 7.604.697.699-.7.698-.697-.699z" /><path d="m50.806 13.218-.697.697-.698-.698.697-.697zm-6.947-6.782.696.699-.7.698-.697-.699zm12.689 14.599-.699-.697.696-.699.7.697zm.517-3.978.697.699-.7.698-.697-.699zM20.66 24.613c.62-1.076 1.413-3.979 1.115-4.662-.436-1.002-2.106-2.971-3.198-2.977-3.124-.014-6.06 2.426-6.77 3.646-.967 1.662.501 4.844 2.455 5.654 2.927 1.217 4.638 1.398 6.398-1.661m21.915 7.446c-.929.252-2.952 1.406-3.162 1.943-.312.787-.474 2.779.121 3.381 1.703 1.717 4.646 1.99 5.702 1.711 1.439-.381 2.376-2.928 1.752-4.441-.937-2.268-1.775-3.303-4.413-2.594M21.051 42.998c-1.967.813-2.866 1.541-2.25 3.828.218.807 1.219 2.561 1.685 2.744.683.27 2.412.41 2.933-.105 1.49-1.479 1.727-4.029 1.484-4.947-.331-1.248-2.54-2.061-3.852-1.52m30.044-17.48c-1.249.33-2.062 2.54-1.52 3.852.813 1.967 2.699 2.301 4.794 1.191 1.771-.938 1.892-4.145 1.375-4.667-1.477-1.49-3.732-.619-4.649-.376m-26.371-7.432-2.004-2.004 2.004-2.004 2.004 2.004zM14.667 33.51l2.005-2.003 2.003 2.004-2.004 2.003zm22.036 13.327L34.7 44.833l2.004-2.004 2.004 2.004zm-2.001-10.274 2.7 2.7-2.7 2.7-2.7-2.7zm-7.278-24.03-2.699-2.699 2.7-2.7 2.699 2.7zm15.735 35.792-2.004-2.004 2.004-2.004 2.004 2.004zm7.937-11.061-2.004-2.004 2.004-2.004L53.1 35.26zm-8.249-13.649 1 1-1 1-1-1zM14.668 39.264l-1-1 1-1 1 1z" /></svg> },
        { name: "Cake", icon: <svg className="size-6" height="200" width="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlSpace="preserve"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M505.822 141.442c-6.987-14.224-18.973-26.423-34.368-37.08-23.162-15.953-54.417-28.598-91.228-37.5-36.792-8.863-79.122-13.88-124.23-13.88-68.726.028-130.994 11.586-177.134 30.884-23.07 9.709-42.181 21.322-56.117 35.083-6.95 6.902-12.599 14.363-16.575 22.493-3.958 8.102-6.178 16.901-6.17 25.931v177.254c-.008 9.012 2.212 17.82 6.17 25.922 6.986 14.215 18.972 26.423 34.377 37.09 23.162 15.943 54.417 28.588 91.218 37.498 36.793 8.864 79.132 13.881 124.231 13.881 68.735-.028 130.994-11.586 177.132-30.902 23.079-9.69 42.191-21.313 56.118-35.083 6.949-6.884 12.598-14.363 16.575-22.484 3.966-8.102 6.187-16.91 6.178-25.922V167.373c.009-9.031-2.211-17.829-6.177-25.931M67.463 126.623c6.308-4.72 13.704-8.744 21.666-12.376 7.962-3.623 16.472-6.829 24.853-9.607 16.808-5.547 32.872-9.318 43.166-10.814 6.634-.938 12.785 3.661 13.723 10.304.948 6.624-3.651 12.775-10.286 13.713-6.048.856-16.352 3.086-27.538 6.309-11.205 3.205-23.469 7.433-33.838 12.181-6.913 3.131-12.99 6.541-17.189 9.718-5.37 4.005-12.97 2.927-16.984-2.434-4.022-5.362-2.934-12.972 2.427-16.994m420.269 218.004c-.009 5.091-1.199 10.071-3.726 15.283-4.386 9.068-13.23 18.731-26.34 27.743-19.604 13.565-48.434 25.541-83.126 33.876-34.693 8.38-75.257 13.22-118.544 13.22-65.938.028-125.623-11.307-167.75-29.006-21.053-8.808-37.656-19.233-48.406-29.936-5.389-5.332-9.328-10.713-11.856-15.897-2.527-5.212-3.716-10.192-3.716-15.283V320.07c4.85 4.636 10.294 9.003 16.278 13.146 23.162 15.944 54.417 28.598 91.218 37.498 36.793 8.864 79.132 13.881 124.231 13.881 68.735-.018 130.994-11.585 177.132-30.902 22.28-9.356 40.806-20.515 54.604-33.661zm0-74.431c-.009 5.1-1.199 10.099-3.726 15.293-4.386 9.069-13.23 18.74-26.34 27.752-19.604 13.565-48.434 25.542-83.126 33.894-34.693 8.362-75.257 13.203-118.544 13.203-65.938.028-125.623-11.316-167.75-29.016-21.053-8.808-37.656-19.232-48.406-29.926-5.389-5.342-9.328-10.721-11.856-15.906-2.527-5.194-3.716-10.192-3.716-15.293V265.3c2.277.558 4.646.892 7.08.892 16.574 0 30.01-13.425 30.01-30.01V225.59c.008-4.18 1.672-7.878 4.412-10.647 2.751-2.731 6.449-4.394 10.629-4.394 4.19 0 7.888 1.663 10.648 4.394 2.74 2.769 4.394 6.467 4.403 10.647v37.322c.01 19.056 15.433 34.461 34.461 34.469 19.038-.008 34.461-15.414 34.47-34.469V247.87c0-4.19 1.663-7.879 4.403-10.638 2.75-2.732 6.448-4.404 10.638-4.404s7.888 1.672 10.639 4.404c2.731 2.759 4.404 6.448 4.404 10.638v45.154c.018 20.236 16.398 36.625 36.634 36.625 20.226-.008 36.616-16.389 36.625-36.625v-26.089c0-4.784 1.904-9.04 5.044-12.18s7.386-5.036 12.162-5.045c4.794.009 9.031 1.904 12.18 5.045 3.122 3.149 5.036 7.395 5.036 12.18v10.927c.019 19.038 15.433 34.451 34.461 34.451 19.037 0 34.46-15.414 34.46-34.451v-34.656c.018-4.784 1.914-9.012 5.044-12.162 3.15-3.131 7.387-5.036 12.181-5.036 4.776 0 9.022 1.904 12.171 5.036 3.122 3.149 5.036 7.377 5.036 12.162v15.516c.009 17.356 14.057 31.412 31.404 31.412 17.356 0 31.404-14.057 31.422-31.412v-44.949c0-3.336 1.32-6.263 3.494-8.446 2.202-2.184 5.129-3.513 8.455-3.513s6.262 1.329 8.455 3.513c1.43 1.439 2.443 3.223 3 5.212v59.657z" style={{ "fill": "#000" }} /></svg> },
        { name: "Pastries", icon: <svg className="size-6" height="200" width="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlSpace="preserve"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M512 275.052c-.038-4.608-1.333-8.486-3.276-12.005-1.889-3.283-4.418-6.331-8.296-8.692l.023-.038-219.034-139.124c-14.923-34.364-43.224-51.306-61.933-51.306-4.357 0-9.263 1.005-14.375 2.842l-13.674-8.684-.068-.038c-7.237-4.403-15.494-5.812-24.347-5.858-9.24.016-19.318 1.699-29.908 4.8-15.867 4.67-32.863 12.592-48.989 23.63-16.104 11.038-31.325 25.215-43.247 42.538-16.455 23.942-27.645 47.916-34.737 69.862C3.047 214.948.015 234.838 0 251.025c.008 2.842.13 5.539.32 8.167v164.712c.008 19.86 16.096 35.941 35.948 35.948h435.456c19.479-.007 35.385-15.494 35.941-34.942l4.091-147.519h-.038c.084-.777.282-1.6.282-2.339M260.087 158.004c.556-6.407 3.565-11.412 6.704-11.175 3.146.236 5.24 5.63 4.684 12.044-.563 6.399-3.565 11.404-6.711 11.16-3.146-.236-5.233-5.622-4.677-12.029m-12.531-53.476c3.123-.45 6.506 4.334 7.572 10.688 1.052 6.361-.617 11.869-3.733 12.318s-6.506-4.327-7.572-10.681c-1.051-6.353.617-11.868 3.733-12.325m-7.466 97.37c.556-6.399 3.558-11.396 6.712-11.16 3.138.236 5.233 5.622 4.677 12.029s-3.558 11.412-6.712 11.175c-3.145-.236-5.241-5.629-4.677-12.044m-23.287-43.886c.563-6.414 3.565-11.411 6.711-11.167 3.139.236 5.233 5.629 4.677 12.028-.556 6.406-3.565 11.412-6.704 11.168-3.146-.237-5.24-5.622-4.684-12.029m-11.671 43.947c1.066 6.354-.602 11.861-3.725 12.31-3.116.449-6.506-4.327-7.564-10.68-1.059-6.354.601-11.868 3.732-12.318 3.116-.456 6.49 4.335 7.557 10.688m-19.037-84.991c.61-6.407 3.649-11.389 6.795-11.137 3.131.259 5.195 5.659 4.602 12.066-.61 6.399-3.649 11.381-6.795 11.13-3.139-.259-5.195-5.661-4.602-12.059m298.184 307.279c-.19 6.795-5.751 12.203-12.554 12.203H36.268c-6.917-.015-12.531-5.622-12.547-12.546v-40.359h461.685zm2.133-77.017H23.874c-.053-.007-.099-.03-.152-.037v-56.388h464.26zm2.05-72.026H24.552l-.662-.747c-.053-.068-.115-.228-.168-.312v-15.434l-.038-.472a85 85 0 0 1-.274-7.214c-.016-13.247 2.574-31.019 8.997-50.848 6.414-19.845 16.629-41.799 31.758-63.807 13.301-19.38 32.254-34.821 51.459-45.219 9.59-5.203 19.219-9.149 28.086-11.754 8.86-2.613 16.988-3.855 23.31-3.848 6.041-.038 10.277 1.226 11.976 2.324l3.717 2.361c-18.816 16.271-35.217 44.77-35.217 86.082 0 55.876 45.989 68.91 71.988 68.91s71.988-13.034 71.988-68.91c0-6.239-.488-12.09-1.188-17.75l197.819 125.64.373.609.046.145zM177.266 170.856c-3.108.457-6.498-4.335-7.557-10.68-1.066-6.361.61-11.868 3.726-12.318 3.116-.457 6.506 4.326 7.572 10.68 1.051 6.36-.617 11.869-3.741 12.318" style={{ "fill": "#000" }} /></svg> },
        { name: "Croissant", icon: <svg className="size-6" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M40 2.047c-2.766 0-5.676 1.172-7.816 2.289a14.2 14.2 0 0 0-5.133.191c-1.149.262-2.301.711-3.219 1.528-.914.816-1.539 2.05-1.539 3.554v.97c-.152-.013-.363-.095-.508-.095-1.515 0-3.668.098-5.566 1.094-1.899.992-3.438 3.04-3.438 6.293v.66c-.32.004-.66-.043-.965.032-1.355.332-3.015.878-4.363 2.156C6.11 22 5.164 24.008 5.164 26.89v1.015c-.031.035-.059.024-.086.067-1.121 1.789-3.031 6.328-3.031 11.054 0 3.016.672 5.243 1.89 6.743 1.22 1.503 2.977 2.183 4.77 2.183 3.66 0 7.36-1.773 11.29-4.637 3.925-2.863 8.108-6.851 12.718-11.488C41.735 22.762 47.953 15.36 47.953 8c0-2.219-1.219-3.852-2.785-4.75-1.57-.902-3.461-1.203-5.168-1.203m0 1.906c1.469 0 3.078.3 4.219.953 1.136.649 1.828 1.516 1.828 3.094 0 6.242-5.73 13.484-14.688 22.484-4.586 4.614-8.722 8.543-12.488 11.29s-7.133 4.273-10.164 4.273c-1.34 0-2.437-.434-3.285-1.48-.852-1.044-1.469-2.81-1.469-5.54 0-3.953 1.672-8.035 2.563-9.609.234.027.511.07.898.145.941.175 2.223.453 3.555.687 1.336.234 2.719.434 3.937.453 1.219.02 2.364-.015 3.153-.93.402-.468.39-1.257.148-1.71s-.594-.762-1.012-1.067c-.836-.61-1.996-1.14-3.328-1.543-2.023-.61-4.453-.937-6.515-.262.265-1.363.722-2.425 1.418-3.086.968-.921 2.277-1.39 3.5-1.687.421-.102 1.539.012 2.847.36 1.309.343 2.844.859 4.363 1.331 1.516.47 3.016.895 4.356 1.043.668.075 1.305.086 1.91-.047.602-.132 1.203-.433 1.61-.964.417-.543.449-1.328.218-1.899-.23-.57-.625-1.023-1.117-1.46-.977-.868-2.375-1.645-3.953-2.239-1.574-.594-3.324-.988-4.996-.98a7.8 7.8 0 0 0-2.383.37c.402-1.253 1.031-2.167 1.98-2.667 1.395-.73 3.266-.875 4.68-.875.508 0 1.633.238 2.895.582 1.261.347 2.699.793 4.07 1.16 1.367.367 2.645.668 3.734.695.543.012 1.055-.023 1.563-.293s.91-.926.91-1.535c0-1.125-.672-2.059-1.535-2.738-.867-.684-1.969-1.184-3.176-1.54-1.894-.558-3.957-.609-5.824-.253.152-.387.375-.715.683-.992.567-.504 1.422-.872 2.372-1.09 1.898-.438 4.195-.25 4.695-.153l.328.063.3-.156c1.99-1.059 4.915-2.188 7.2-2.188M26.434 10.07c1.082.016 2.242.18 3.273.48 1.031.305 1.941.747 2.531 1.212.528.414.684.777.727 1.11-.098.023-.176.054-.434.046-.746-.02-1.968-.273-3.289-.629-1.32-.355-2.75-.797-4.055-1.156-.824-.227-1.457-.293-2.144-.41l.566-.23c.73-.298 1.739-.438 2.825-.423m-8.914 7.403c1.351-.008 2.914.332 4.316.855 1.402.527 2.644 1.25 3.352 1.879.355.316.558.613.613.746.02.043.023.031.027.035-.078.102-.2.188-.488.25-.3.067-.75.078-1.293.016-1.086-.117-2.516-.512-4.004-.973-1.488-.457-3.035-.98-4.441-1.351-.457-.121-.868-.192-1.29-.274l.114-.125c.668-.703 1.746-1.05 3.094-1.058M9.672 26.77c1.183-.036 2.476.16 3.64.511 1.168.352 2.192.848 2.762 1.262.04.027.028.031.063.059-.25.082-.465.203-1.2.195-1.027-.016-2.347-.2-3.636-.426-1.285-.23-2.551-.5-3.535-.683-.336-.067-.594-.102-.868-.141.707-.485 1.676-.742 2.774-.777" /></svg> },
        { name: "Bagel", icon: <svg className="size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path fillRule="evenodd" clipRule="evenodd" d="M2.924 10.207a9.3 9.3 0 0 0-.15 2.466l.066.054c.22.176.53.41.892.643.757.488 1.6.88 2.268.88.436 0 .964-.169 1.518-.448.337-.17.659-.367.943-.56a3.75 3.75 0 1 1 6.658.841c.222.107.452.167.686.167.463 0 .682-.22 1.117-.734l.032-.038c.361-.428.889-1.054 1.826-1.198a.75.75 0 0 1-.276-1.28l1.678-1.478a.75.75 0 0 1 .686-.163 9.2 9.2 0 0 0-.977-2.189l-.36.36a.75.75 0 1 1-1.061-1.06l.524-.524A9.23 9.23 0 0 0 12 2.75c-1.77 0-3.424.497-4.83 1.36l.36.36a.75.75 0 0 1-1.06 1.06l-.524-.524a9.3 9.3 0 0 0-2.377 3.182.75.75 0 0 1 .784.708l.079 1.412a.75.75 0 1 1-1.498.083zm18.23.458-1.659 1.46a.8.8 0 0 1-.2.127c.757.029 1.398.347 1.904.728a9.4 9.4 0 0 0-.045-2.315m-.303 4.032c-.442-.499-1.032-.947-1.667-.947-.463 0-.681.22-1.116.734l-.032.038c-.41.487-1.036 1.228-2.23 1.228-.708 0-1.316-.257-1.803-.58-.58.367-1.266.58-2.003.58a3.74 3.74 0 0 1-2.767-1.22c-.31.208-.664.423-1.04.612-.642.323-1.417.608-2.193.608-1.013 0-2.047-.488-2.82-.957a9.254 9.254 0 0 0 17.67-.096M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12m9.22-8.53a.75.75 0 0 1 1.06 0l1 1a.75.75 0 0 1-1.06 1.06l-1-1a.75.75 0 0 1 0-1.06m5.98.93a.75.75 0 0 1 .15 1.05l-1.5 2a.75.75 0 1 1-1.2-.9l1.5-2a.75.75 0 0 1 1.05-.15m-5.226 2.406a.75.75 0 0 1-.53.918l-1.366.366a.75.75 0 1 1-.388-1.448l1.366-.366a.75.75 0 0 1 .918.53m-5.327.368a.75.75 0 0 1 .993.372l.585 1.287a.75.75 0 0 1-1.365.621l-.586-1.287a.75.75 0 0 1 .373-.993m10.718 1.053a.75.75 0 0 1 .784.714l.066 1.413a.75.75 0 1 1-1.498.07l-.066-1.412a.75.75 0 0 1 .714-.785M12 9.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5m-5.057 1.145a.75.75 0 0 1 .162 1.048l-.835 1.141a.75.75 0 1 1-1.21-.886l.835-1.14a.75.75 0 0 1 1.048-.163" fill="#1c274c" /></svg> },
        { name: "Bread", icon: <svg className="size-6" height="200" width="200" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000"><g id="SVGRepo_bgCarrier" strokeWidth="0" /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path className="st0" d="M512 159.234c0-2.486-.099-5.013-.264-7.572-1.338-19.604-9.365-38.366-22.279-54.682-19.471-24.542-49.628-44.335-88.802-58.389C361.433 24.586 312.961 16.411 256 16.404c-75.952.04-136.811 14.475-180.774 38.116-21.948 11.858-39.735 26.085-52.683 42.46C9.613 113.296 1.585 132.058.265 151.653A107 107 0 0 0 0 159.234c0 .924.116 1.792.133 2.708-.05 1.297-.133 2.617-.133 3.898-.033 13.757 2.857 26.382 8.291 37.126 4.046 8.06 9.447 14.979 15.574 20.619 9.232 8.472 19.934 14.104 30.718 17.762 4.013 1.355 8.059 2.379 12.089 3.237v229.874c0 5.566 2.246 11.015 6.193 14.945 3.931 3.94 9.381 6.194 14.946 6.194h336.378c5.566 0 10.999-2.254 14.946-6.194 3.931-3.93 6.193-9.38 6.193-14.945V244.633c2.824-.603 5.648-1.289 8.473-2.131 14.385-4.302 28.95-11.982 40.181-24.979 5.582-6.465 10.206-14.21 13.311-22.956 3.105-8.736 4.706-18.406 4.706-28.728 0-1.123-.083-2.287-.132-3.427.034-1.064.133-2.105.133-3.178m-53.476 25.648c-1.717 3.468-3.864 6.284-6.54 8.811-3.98 3.757-9.299 6.829-15.607 9.009-6.293 2.188-13.477 3.427-20.463 3.724-11.28.504-20.197 9.835-20.197 21.123v232.532h-294.1V227.548c0-11.288-8.918-20.619-20.198-21.123-6.209-.264-12.584-1.272-18.331-3.03-8.704-2.651-15.657-6.87-20.248-12.337-2.329-2.766-4.195-5.904-5.599-9.9-1.123-3.262-1.915-7.167-2.18-11.882l.05-1.182c.678-9.587 4.608-19.718 13.146-30.346 12.7-15.871 36.068-32.047 69.842-43.814 33.724-11.817 77.621-19.339 130.568-19.331 70.586-.05 125.086 13.443 160.857 32.394 17.902 9.438 31.048 20.181 39.553 30.751 8.522 10.628 12.453 20.76 13.146 30.338l.016.694c-.329 6.861-1.733 12.039-3.715 16.102" /><path className="st0" d="M225.002 211.587a10.56 10.56 0 0 0-10.57 10.57c0 5.846 4.723 10.57 10.57 10.57a10.56 10.56 0 0 0 10.57-10.57 10.56 10.56 0 0 0-10.57-10.57m110.981 71.873c0-8.762-7.101-15.854-15.854-15.854-8.77 0-15.855 7.093-15.855 15.854 0 8.752 7.085 15.854 15.855 15.854 8.753.001 15.854-7.101 15.854-15.854m-161.716 23.253c-7.002 0-12.684 5.68-12.684 12.684 0 7.002 5.682 12.684 12.684 12.684s12.684-5.682 12.684-12.684c0-7.003-5.681-12.684-12.684-12.684m175.456-150.088a10.564 10.564 0 0 0-10.57 10.57c0 5.838 4.723 10.57 10.57 10.57 5.83 0 10.57-4.732 10.57-10.57 0-5.839-4.74-10.57-10.57-10.57m-103.582-46.507c0-5.838-4.74-10.57-10.57-10.57a10.564 10.564 0 0 0-10.57 10.57c0 5.838 4.723 10.57 10.57 10.57 5.83 0 10.57-4.732 10.57-10.57" /><circle className="st0" cx="123.533" cy="158.739" r="6.342" /><circle className="st0" cx="157.356" cy="416.638" r="6.342" /><path className="st0" d="M340.21 391.006c-6.572 0-11.89 5.326-11.89 11.891 0 6.564 5.318 11.89 11.89 11.89 6.557 0 11.891-5.326 11.891-11.89.001-6.565-5.334-11.891-11.891-11.891m-92.534-9.487c-5.384 0-9.76 4.368-9.76 9.752s4.376 9.752 9.76 9.752 9.744-4.368 9.744-9.752c.001-5.384-4.359-9.752-9.744-9.752" /></g></svg> },
    ];

const sales = [
  { day: "Mon", value: 0 },
  { day: "Tue", value: 0 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 1 },
  { day: "Fri", value: 0 },
  { day: "Sat", value: 0 },
  { day: "Sun", value: 0 },
];

function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
 
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h2 className="font-text tracking-wider text-[22px] font-black tracking-[-0.04em] text-[#3a1715]">
          {children}
        </h2>

        <span className="relative flex h-7 w-7 items-center justify-center">
          <span className="absolute left-0 top-1 h-[2px] w-5 rotate-[-15deg] bg-[#3a1715]" />
          <span className="absolute left-1 top-4 h-[2px] w-3 rotate-[35deg] bg-[#3a1715]" />
        </span>
      </div>

      {action}
    </div>
  );
}

function OutlineButton({
  children,
  yellow = false,
}: {
  children: React.ReactNode;
  yellow?: boolean;
}) {
  return (
    <button
      className={[
        "group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 cursor-pointer",
        "font-text tracking-wider text-[11px] font-black uppercase tracking-[-0.01em]",
        "transition-all duration-200 hover:-translate-y-0.5",
        yellow
          ? "border-[#17100f] bg-[#ffd21c] text-[#351615] hover:bg-[#ffdb3f]"
          : "border-[#5a3b38] bg-white text-[#351615] hover:bg-[#fff8e9]",
      ].join(" ")}
    >
      {children}

      <ArrowRight
        size={14}
        strokeWidth={3}
        className="transition-transform group-hover:translate-x-0.5"
      />
    </button>
  );
}

function StatusBadge({
  type,
  children,
}: {
  type: string;
  children: React.ReactNode;
}) {
  const styles =
    type === "delivered"
      ? "bg-[#b9ebc8] text-[#1c4b2b]"
      : type === "pending"
        ? "bg-[#f7d5c6] text-[#743a2c]"
        : "bg-[#ffd638] text-[#3a1715]";

  const dot =
    type === "delivered"
      ? "bg-[#2b9a50]"
      : type === "pending"
        ? "bg-[#f29b24]"
        : "bg-[#e74435]";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-text tracking-wider text-[10px] font-black ${styles}`}
    >
      {children}
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
    </span>
  );
}

function UserAvatar({
  initials,
  index,
}: {
  initials: string;
  index: number;
}) {
  const backgrounds = [
    "bg-[#ead4c5]",
    "bg-[#e6c7ae]",
    "bg-[#d7d8c4]",
    "bg-[#ead8d1]",
  ];

  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white text-[11px] font-bold text-[#4a2722] shadow-sm ${backgrounds[index % backgrounds.length]}`}
    >
      {initials}

      <span
        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
          index < 2 ? "bg-[#42a861]" : "bg-[#f4bc36]"
        }`}
      />
    </div>
  );
}

export default function AdminDashboard() {
  const { adminData, admin, orders, allUsers,products } = useAuthStore();
  const stats = [
  {
    title: "TOTAL REVENUE",
    value: "₹"+adminData!.revenue,
    change: "+"+adminData!.totalOrders+"%",
    description: "vs last week",
    icon: "₹",
    highlight: false,
  },
  {
    title: "TOTAL ORDERS",
    value: "₹"+adminData!.totalOrders,
    change: "+"+adminData!.totalOrders+"%",
    description: "vs last week",
    icon: <ShoppingBag size={25} strokeWidth={2.2} />,
    highlight: true,
  },
  {
    title: "TOTAL USERS",
    value: adminData!.totalUsers,
    change: "+"+(adminData!.totalUsers+1)+"%",
    description: "vs last week",
    icon: <Users size={25} strokeWidth={2.2} />,
    highlight: false,
  },
  {
    title: "TOTAL PRODUCTS",
    value: adminData!.totalProducts,
    change: "Same",
    description: "vs last week",
    icon: <Package size={25} strokeWidth={2.2} />,
    highlight: false,
  },
];
  const maxSale = useMemo(
    () => Math.max(...sales.map((item) => item.value)),
    [],
  );

  return (
    <main className="bg-[#f8f0e8]">
      <AdminHeader activeTab="dashboard" />
      {/* -------------------------------------------------------
          HEADER
      ------------------------------------------------------- */}
      

      {/* -------------------------------------------------------
          CONTENT
      ------------------------------------------------------- */}
      <div className="mx-auto max-w-[1500px] px-5 pb-10 pt-8 sm:px-8 lg:px-10">
        {/* -----------------------------------------------------
            HERO
        ----------------------------------------------------- */}
        <section className="relative mb-8 overflow-hidden">
          {/* little decorative rays */}
          <div className="absolute left-0 top-2 hidden lg:block">
            <span className="absolute h-[2px] w-7 rotate-[15deg] bg-[#351615]" />
            <span className="absolute left-4 top-5 h-[2px] w-5 rotate-[-25deg] bg-[#351615]" />
          </div>

          <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="pl-0 lg:pl-5">
              <div className="relative inline-block">
                <h1 className="font-text tracking-wider text-[48px] font-black leading-[0.88] tracking-[-0.065em] text-[#351615] sm:text-[62px] lg:text-[72px]">
                  GOOD MORNING,
                  <br />
                  ADMIN<span className="text-[#ed5a3d]">.</span>
                </h1>

                <span className="absolute -bottom-3 left-1 h-[6px] w-[210px] rotate-[-2deg] rounded-full bg-[#ffd21c] sm:w-[275px]" />
              </div>

              <div className="mt-7 flex flex-wrap font-text items-center gap-x-4 gap-y-2 text-[13px] font-semibold text-[#775f58]">
                <span>
                  Here&apos;s what&apos;s happening with your bakery today.
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-[#806760] sm:block" />

                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Mon, 6 Oct 2026
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-[#806760] sm:block" />

                <span className="flex items-center gap-1.5 text-[#31804a]">
                  <span className="h-2 w-2 rounded-full bg-[#38a75a]" />
                  All systems running smoothly!
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* -----------------------------------------------------
            KPI CARDS
        ----------------------------------------------------- */}
        <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className={[
                "group relative overflow-hidden rounded-[22px] border px-6 py-5",
                "shadow-[0_2px_0_rgba(53,22,21,0.12)]",
                "transition-transform duration-200 hover:-translate-y-1",
                stat.highlight
                  ? "border-[#2f1a17] bg-[#ffd21c]"
                  : "border-[#876d64] bg-[#fffaf5]",
              ].join(" ")}
            >
              {/* decorative lines */}
              <div className="absolute right-6 top-5">
                <span className="block h-[2px] w-5 rotate-[-65deg] bg-[#351615]" />
                <span className="ml-3 mt-1 block h-[2px] w-3 rotate-[40deg] bg-[#351615]" />
              </div>

              <div className="flex items-center gap-5">
                <div
                  className={[
                    "flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full",
                    stat.highlight ? "bg-[#fff7cf]" : "bg-[#ffedb0]",
                  ].join(" ")}
                >
                  {typeof stat.icon === "string" ? (
                    <span className="font-text tracking-wider text-[27px] font-black">
                      {stat.icon}
                    </span>
                  ) : (
                    stat.icon
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-text tracking-wider text-[11px] font-black tracking-[0.02em] text-[#6b4d46]">
                    {stat.title}
                  </p>

                  <p className="mt-1 whitespace-nowrap font-text tracking-wider text-[28px] font-black tracking-[-0.05em] text-[#351615] sm:text-[31px]">
                    {stat.value}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 pl-1">
                <span className="flex items-center gap-0.5 text-[12px] font-bold text-[#278a4b]">
                  <ArrowUpRight size={14} strokeWidth={3} />
                  {stat.change}
                </span>

                <span className="text-[11px] font-semibold text-[#806a62]">
                  {stat.description}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* -----------------------------------------------------
            ORDERS + USERS
        ----------------------------------------------------- */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.75fr_1fr]">
          {/* ORDERS */}
          <div className="rounded-[22px] border border-[#876d64] bg-[#fffaf5] p-5 shadow-[0_2px_0_rgba(53,22,21,0.1)] sm:p-6">
                <SectionTitle
                  action={
            <Link href="/admin/order">
                    <OutlineButton yellow>
                      VIEW ALL ORDERS
                    </OutlineButton>
            </Link>
                  }
                  >
                  RECENT ORDERS
                </SectionTitle>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#e7dcd2] text-left">
                    <th className="pb-3 pl-1 font-text tracking-wider text-[10px] font-black text-[#856e66]">
                      # ORDER ID
                    </th>
                    <th className="pb-3 font-text tracking-wider text-[10px] font-black text-[#856e66]">
                      CUSTOMER
                    </th>
                    <th className="pb-3 font-text tracking-wider text-[10px] font-black text-[#856e66]">
                      ITEMS
                    </th>
                    <th className="pb-3 font-text tracking-wider text-[10px] font-black text-[#856e66]">
                      AMOUNT
                    </th>
                    <th className="pb-3 font-text tracking-wider text-[10px] font-black text-[#856e66]">
                      STATUS
                    </th>
                    <th className="pb-3 font-text tracking-wider text-[10px] font-black text-[#856e66]">
                      DATE
                    </th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const currentUser = allUsers?.find(user=>user._id==order.userId)
                    const date = new Date(order.createdAt)
                    return (<tr
                      key={order.orderId}
                      className="border-b border-[#eee4dc] last:border-0"
                    >
                      <td className="py-3 pl-1">
                        <span className="font-text tracking-wider text-[12px] font-black">
                          {order.orderId}
                        </span>
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            initials={currentUser?.name[0]||""}
                            index={orders.indexOf(order)}
                          />
                          <span className="whitespace-nowrap text-[12px] font-semibold">
                            {currentUser?.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          {order.items.map((item, index) => (
                            <p
                              key={`${order.orderId}-${index}`}
                              className="flex overflow-hidden h-8 w-8 items-center justify-center rounded-full border border-[#e4d6cb] bg-[#fff3df] text-base"
                            >
                              <img src={`${process.env.NEXT_PUBLIC_API_URL}/images/${item.image}`} className="h-full w-full" />
                            </p>
                          ))}

                          <span className="ml-1 text-[11px] font-bold text-[#806a62]">
                            +{order.items.length}
                          </span>
                        </div>
                      </td>

                      <td className="py-3">
                        <span className="font-text tracking-wider text-[12px] font-black">
                          {order.total}
                        </span>
                      </td>

                      <td className="py-3">
                        <StatusBadge type={order.orderStatus}>
                          {order.orderStatus}
                        </StatusBadge>
                      </td>

                      <td className="whitespace-nowrap py-3 text-[11px] font-medium text-[#806a62]">
                        {date.toLocaleDateString("en-IN")}
                      </td>

                      <td className="py-3 text-right">
                        <button className="rounded-full p-1.5 transition-colors hover:bg-[#f4e8df]">
                          <MoreHorizontal size={17} />
                        </button>
                      </td>
                    </tr>
                    )})}
                </tbody>
              </table>
            </div>

            {/* Mobile orders */}
            <div className="space-y-3 md:hidden">
              {orders.map((order, index) => {
                const currentUser = allUsers?.find(user=>user._id==order.userId)
              return(<div
                  key={order.orderId}
                  className="rounded-2xl border border-[#e8ddd4] bg-white p-3.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar initials={currentUser?.name[0]||""} index={index} />

                      <div>
                        <p className="text-[12px] font-bold">
                          {currentUser?.name}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#856e66]">
                          {order.orderId}
                        </p>
                      </div>
                    </div>

                    <button>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge type={order.orderStatus}>
                      {order.orderStatus}
                    </StatusBadge>

                    <span className="font-text tracking-wider text-[13px] font-black">
                      {order.total}
                    </span>
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* USERS */}
          <div className="rounded-[22px] border border-[#876d64] bg-[#fffaf5] p-5 shadow-[0_2px_0_rgba(53,22,21,0.1)] sm:p-6">
            <SectionTitle
              action={
                <OutlineButton yellow>
                  VIEW ALL USERS
                </OutlineButton>
              }
            >
              USERS
            </SectionTitle>

            <div className="space-y-1">
              {(allUsers||[]).map((user, index) => (
                <div
                  key={user.email}
                  className="group flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-[#fff1df]"
                >
                  <UserAvatar initials={user.name[0]} index={index} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-bold text-[#351615]">
                      {user.name}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] font-medium text-[#806a62]">
                      {user.email}
                    </p>
                  </div>

                  <span className="hidden whitespace-nowrap rounded-full bg-[#fff0dc] px-3 py-2 font-text tracking-wider text-[10px] font-black text-[#65453d] sm:block">
                    {user.name} orders
                  </span>

                  <button className="rounded-full p-1.5 opacity-50 transition-opacity hover:opacity-100">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------
            PRODUCTS + SALES
        ----------------------------------------------------- */}
        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.75fr_1fr]">
          {/* PRODUCTS */}
          <div className="rounded-[22px] border border-[#876d64] bg-[#fffaf5] p-5 shadow-[0_2px_0_rgba(53,22,21,0.1)] sm:p-6">
            <SectionTitle
              action={
                <div className="flex items-center gap-2">
                  <button className="hidden items-center gap-1.5 rounded-full border border-[#876d64] bg-white px-4 py-2.5 font-text tracking-wider text-[10px] font-black sm:flex">
                    ADD PRODUCT
                    <Plus size={13} strokeWidth={3} />
                  </button>

                  <Link href="/admin/items">
                  <OutlineButton yellow>
                    VIEW ALL PRODUCTS
                  </OutlineButton>
                  </Link>
                </div>
              }
            >
              PRODUCTS
            </SectionTitle>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map((product) => (
                <button
                  key={product.name}
                  className="group relative rounded-2xl border border-[#e4d9d0] bg-white p-3 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#c5b3a8] hover:shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0bd] text-[25px]">
                    {product.icon}
                  </div>

                  <p className="mt-3 font-text tracking-wider text-[10px] font-black text-[#5c403a]">
                    {product.name}
                  </p>

                  <div className="mt-1 flex items-end justify-between">
                    <span className="font-text tracking-wider text-[20px] font-black">
                      {products.filter(pro=>pro.category==product.name).length}
                    </span>

                    <ArrowRight
                      size={14}
                      className="mb-1 transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SALES */}
          <div className="rounded-[22px] border border-[#876d64] bg-[#fffaf5] p-5 shadow-[0_2px_0_rgba(53,22,21,0.1)] sm:p-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-text tracking-wider text-[22px] font-black tracking-[-0.04em]">
                  SALES THIS WEEK
                </h2>

                <span className="relative hidden h-7 w-7 sm:block">
                  <span className="absolute left-0 top-1 h-[2px] w-5 rotate-[-15deg] bg-[#351615]" />
                  <span className="absolute left-1 top-4 h-[2px] w-3 rotate-[35deg] bg-[#351615]" />
                </span>
              </div>

              <span className="flex items-center gap-2 text-[10px] font-semibold text-[#806a62]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffd21c]" />
                Revenue (₹)
              </span>
            </div>

            {/* chart */}
            <div className="relative mt-6 h-[190px]">
              {/* horizontal lines */}
              <div className="absolute inset-x-0 top-0 border-t border-[#e6dcd4]" />
              <div className="absolute inset-x-0 top-1/3 border-t border-[#e6dcd4]" />
              <div className="absolute inset-x-0 top-2/3 border-t border-[#e6dcd4]" />
              <div className="absolute inset-x-0 bottom-0 border-t border-[#a99287]" />

              {/* labels */}
              <div className="absolute -left-1 top-[-7px] -translate-x-full pr-2 text-[9px] font-semibold text-[#806a62]">
                1
              </div>

              <div className="absolute -left-1 top-[calc(33.33%-7px)] -translate-x-full pr-2 text-[9px] font-semibold text-[#806a62]">
                2
              </div>

              <div className="absolute -left-1 top-[calc(66.66%-7px)] -translate-x-full pr-2 text-[9px] font-semibold text-[#806a62]">
                3
              </div>

              <div className="absolute bottom-0 left-0 right-0 flex h-full items-end justify-around gap-2 px-1 pb-0">
                {sales.map((item) => {
                  const height = Math.max(
                    12,
                    (item.value / maxSale) * 86,
                  );

                  return (
                    <div
                      key={item.day}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <div
                        className="w-full max-w-[42px] rounded-t-[9px] bg-[#ffd21c] transition-all duration-300 hover:bg-[#ffcf00]"
                        style={{
                          height: `${height}%`,
                        }}
                      />

                      <span className="mt-2 text-[9px] font-bold text-[#806a62]">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------
            SMALL MOBILE ADD BUTTON
        ----------------------------------------------------- */}
        <button className="fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#351615] bg-[#ffd21c] shadow-[0_4px_0_#351615] transition-transform hover:-translate-y-1 sm:hidden">
          <Plus size={23} strokeWidth={3} />
        </button>
      </div>
    </main>
  );
}
