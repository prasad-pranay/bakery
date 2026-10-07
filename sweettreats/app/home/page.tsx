import HeroCards from "./hero";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import BlobButton from "../component/ordernow";
import CircularText from "../component/circularText";
import Footer from "../component/footer";
import FourthSection from "./FourthSection";
import FifthSection from "./FifthSection";
import ThirdSection from "./ThirdSection";


const icons: React.JSX.Element[] = [
    <svg className="size-6" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" ><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M59.896 23.918c-.245-.771-.443-1.315-.476-1.514a5 5 0 0 1-1.29.156c-.775 0-1.67-.15-2.594-.525-2.065-.838-3.416-2.459-3.786-4.514-.233.066-.546.1-.909.1-1.17 0-2.865-.353-4.116-1.137-2.388-1.496-2.862-5.666-2.862-5.666-2.705-.783-4.739-3.965-4.414-6.672C37.024 3.494 34.628 2 31.999 2c-2.633 0-5.033 1.502-7.461 2.15-2.514.672-5.342.592-7.54 1.863-2.232 1.293-3.568 3.793-5.379 5.604-1.813 1.813-4.313 3.148-5.604 5.379-1.273 2.201-1.191 5.027-1.863 7.541C3.504 26.965 2 29.368 2 31.999c0 2.632 1.504 5.033 2.152 7.462.672 2.512.59 5.34 1.863 7.539 1.291 2.232 3.791 3.568 5.604 5.379 1.811 1.811 3.146 4.313 5.379 5.604 2.198 1.275 5.026 1.193 7.54 1.865 2.428.65 4.828 2.152 7.461 2.152 2.635 0 5.035-1.502 7.465-2.152 2.512-.672 5.34-.59 7.538-1.865 2.232-1.291 3.568-3.793 5.379-5.604 1.813-1.811 4.313-3.146 5.604-5.379 1.273-2.199 1.191-5.027 1.863-7.539.648-2.43 2.152-4.83 2.152-7.462s-2.104-8.081-2.104-8.081m-1.025 7.426c-.124.816-.739 1.691-1.393 2.617-.711 1.01-1.518 2.156-1.883 3.527-.248.926-.39 1.85-.527 2.744-.215 1.395-.417 2.711-.979 3.684-.575.992-1.619 1.826-2.724 2.709-.702.561-1.428 1.139-2.097 1.809-.669.668-1.249 1.395-1.81 2.098-.883 1.104-1.716 2.146-2.71 2.723-.971.563-2.286.766-3.679.979-.895.139-1.82.281-2.745.529-.892.238-1.741.57-2.563.895-1.324.52-2.575 1.01-3.763 1.01s-2.438-.492-3.763-1.012c-.82-.322-1.669-.654-2.559-.893-.927-.248-1.853-.391-2.747-.529-1.394-.213-2.709-.416-3.682-.979-.993-.574-1.826-1.619-2.707-2.723-.562-.703-1.142-1.43-1.811-2.098-.669-.67-1.395-1.248-2.097-1.809-1.104-.883-2.148-1.717-2.723-2.709-.563-.973-.766-2.289-.98-3.684-.138-.895-.279-1.818-.526-2.742-.238-.895-.573-1.746-.896-2.57C6.99 33.598 6.5 32.35 6.5 31.167c0-1.186.49-2.436 1.01-3.758.323-.823.657-1.674.896-2.566.247-.926.389-1.85.526-2.745.215-1.394.417-2.711.979-3.684.575-.993 1.619-1.826 2.724-2.708.702-.561 1.428-1.14 2.097-1.809s1.249-1.395 1.811-2.097c.882-1.104 1.715-2.147 2.706-2.722.973-.563 2.289-.765 3.683-.98.895-.138 1.82-.28 2.745-.528.892-.238 1.742-.571 2.563-.894 1.324-.519 2.574-1.009 3.76-1.009q.513 0 1.047-.005.536-.004 1.085-.005c1.136 0 2.301.023 3.36.153.388 2.682 2.187 5.234 4.596 6.449.369 1.652 1.312 4.502 3.575 5.92 1.488.933 3.28 1.339 4.637 1.425.824 1.919 2.393 3.436 4.484 4.285a9 9 0 0 0 3.217.671c.511 1.626 1.238 4.358.87 6.784M48.731 9.453l1.375 1.375-1.375 1.375-1.375-1.375zm6.42 7.604.697.699-.7.698-.697-.699z" /><path d="m50.806 13.218-.697.697-.698-.698.697-.697zm-6.947-6.782.696.699-.7.698-.697-.699zm12.689 14.599-.699-.697.696-.699.7.697zm.517-3.978.697.699-.7.698-.697-.699zM20.66 24.613c.62-1.076 1.413-3.979 1.115-4.662-.436-1.002-2.106-2.971-3.198-2.977-3.124-.014-6.06 2.426-6.77 3.646-.967 1.662.501 4.844 2.455 5.654 2.927 1.217 4.638 1.398 6.398-1.661m21.915 7.446c-.929.252-2.952 1.406-3.162 1.943-.312.787-.474 2.779.121 3.381 1.703 1.717 4.646 1.99 5.702 1.711 1.439-.381 2.376-2.928 1.752-4.441-.937-2.268-1.775-3.303-4.413-2.594M21.051 42.998c-1.967.813-2.866 1.541-2.25 3.828.218.807 1.219 2.561 1.685 2.744.683.27 2.412.41 2.933-.105 1.49-1.479 1.727-4.029 1.484-4.947-.331-1.248-2.54-2.061-3.852-1.52m30.044-17.48c-1.249.33-2.062 2.54-1.52 3.852.813 1.967 2.699 2.301 4.794 1.191 1.771-.938 1.892-4.145 1.375-4.667-1.477-1.49-3.732-.619-4.649-.376m-26.371-7.432-2.004-2.004 2.004-2.004 2.004 2.004zM14.667 33.51l2.005-2.003 2.003 2.004-2.004 2.003zm22.036 13.327L34.7 44.833l2.004-2.004 2.004 2.004zm-2.001-10.274 2.7 2.7-2.7 2.7-2.7-2.7zm-7.278-24.03-2.699-2.699 2.7-2.7 2.699 2.7zm15.735 35.792-2.004-2.004 2.004-2.004 2.004 2.004zm7.937-11.061-2.004-2.004 2.004-2.004L53.1 35.26zm-8.249-13.649 1 1-1 1-1-1zM14.668 39.264l-1-1 1-1 1 1z" /></svg>,
    <svg className="size-6" height="200" width="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlSpace="preserve"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M505.822 141.442c-6.987-14.224-18.973-26.423-34.368-37.08-23.162-15.953-54.417-28.598-91.228-37.5-36.792-8.863-79.122-13.88-124.23-13.88-68.726.028-130.994 11.586-177.134 30.884-23.07 9.709-42.181 21.322-56.117 35.083-6.95 6.902-12.599 14.363-16.575 22.493-3.958 8.102-6.178 16.901-6.17 25.931v177.254c-.008 9.012 2.212 17.82 6.17 25.922 6.986 14.215 18.972 26.423 34.377 37.09 23.162 15.943 54.417 28.588 91.218 37.498 36.793 8.864 79.132 13.881 124.231 13.881 68.735-.028 130.994-11.586 177.132-30.902 23.079-9.69 42.191-21.313 56.118-35.083 6.949-6.884 12.598-14.363 16.575-22.484 3.966-8.102 6.187-16.91 6.178-25.922V167.373c.009-9.031-2.211-17.829-6.177-25.931M67.463 126.623c6.308-4.72 13.704-8.744 21.666-12.376 7.962-3.623 16.472-6.829 24.853-9.607 16.808-5.547 32.872-9.318 43.166-10.814 6.634-.938 12.785 3.661 13.723 10.304.948 6.624-3.651 12.775-10.286 13.713-6.048.856-16.352 3.086-27.538 6.309-11.205 3.205-23.469 7.433-33.838 12.181-6.913 3.131-12.99 6.541-17.189 9.718-5.37 4.005-12.97 2.927-16.984-2.434-4.022-5.362-2.934-12.972 2.427-16.994m420.269 218.004c-.009 5.091-1.199 10.071-3.726 15.283-4.386 9.068-13.23 18.731-26.34 27.743-19.604 13.565-48.434 25.541-83.126 33.876-34.693 8.38-75.257 13.22-118.544 13.22-65.938.028-125.623-11.307-167.75-29.006-21.053-8.808-37.656-19.233-48.406-29.936-5.389-5.332-9.328-10.713-11.856-15.897-2.527-5.212-3.716-10.192-3.716-15.283V320.07c4.85 4.636 10.294 9.003 16.278 13.146 23.162 15.944 54.417 28.598 91.218 37.498 36.793 8.864 79.132 13.881 124.231 13.881 68.735-.018 130.994-11.585 177.132-30.902 22.28-9.356 40.806-20.515 54.604-33.661zm0-74.431c-.009 5.1-1.199 10.099-3.726 15.293-4.386 9.069-13.23 18.74-26.34 27.752-19.604 13.565-48.434 25.542-83.126 33.894-34.693 8.362-75.257 13.203-118.544 13.203-65.938.028-125.623-11.316-167.75-29.016-21.053-8.808-37.656-19.232-48.406-29.926-5.389-5.342-9.328-10.721-11.856-15.906-2.527-5.194-3.716-10.192-3.716-15.293V265.3c2.277.558 4.646.892 7.08.892 16.574 0 30.01-13.425 30.01-30.01V225.59c.008-4.18 1.672-7.878 4.412-10.647 2.751-2.731 6.449-4.394 10.629-4.394 4.19 0 7.888 1.663 10.648 4.394 2.74 2.769 4.394 6.467 4.403 10.647v37.322c.01 19.056 15.433 34.461 34.461 34.469 19.038-.008 34.461-15.414 34.47-34.469V247.87c0-4.19 1.663-7.879 4.403-10.638 2.75-2.732 6.448-4.404 10.638-4.404s7.888 1.672 10.639 4.404c2.731 2.759 4.404 6.448 4.404 10.638v45.154c.018 20.236 16.398 36.625 36.634 36.625 20.226-.008 36.616-16.389 36.625-36.625v-26.089c0-4.784 1.904-9.04 5.044-12.18s7.386-5.036 12.162-5.045c4.794.009 9.031 1.904 12.18 5.045 3.122 3.149 5.036 7.395 5.036 12.18v10.927c.019 19.038 15.433 34.451 34.461 34.451 19.037 0 34.46-15.414 34.46-34.451v-34.656c.018-4.784 1.914-9.012 5.044-12.162 3.15-3.131 7.387-5.036 12.181-5.036 4.776 0 9.022 1.904 12.171 5.036 3.122 3.149 5.036 7.377 5.036 12.162v15.516c.009 17.356 14.057 31.412 31.404 31.412 17.356 0 31.404-14.057 31.422-31.412v-44.949c0-3.336 1.32-6.263 3.494-8.446 2.202-2.184 5.129-3.513 8.455-3.513s6.262 1.329 8.455 3.513c1.43 1.439 2.443 3.223 3 5.212v59.657z" style={{ "fill": "#000" }} /></svg>,
    <svg className="size-6" height="200" width="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlSpace="preserve"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M512 275.052c-.038-4.608-1.333-8.486-3.276-12.005-1.889-3.283-4.418-6.331-8.296-8.692l.023-.038-219.034-139.124c-14.923-34.364-43.224-51.306-61.933-51.306-4.357 0-9.263 1.005-14.375 2.842l-13.674-8.684-.068-.038c-7.237-4.403-15.494-5.812-24.347-5.858-9.24.016-19.318 1.699-29.908 4.8-15.867 4.67-32.863 12.592-48.989 23.63-16.104 11.038-31.325 25.215-43.247 42.538-16.455 23.942-27.645 47.916-34.737 69.862C3.047 214.948.015 234.838 0 251.025c.008 2.842.13 5.539.32 8.167v164.712c.008 19.86 16.096 35.941 35.948 35.948h435.456c19.479-.007 35.385-15.494 35.941-34.942l4.091-147.519h-.038c.084-.777.282-1.6.282-2.339M260.087 158.004c.556-6.407 3.565-11.412 6.704-11.175 3.146.236 5.24 5.63 4.684 12.044-.563 6.399-3.565 11.404-6.711 11.16-3.146-.236-5.233-5.622-4.677-12.029m-12.531-53.476c3.123-.45 6.506 4.334 7.572 10.688 1.052 6.361-.617 11.869-3.733 12.318s-6.506-4.327-7.572-10.681c-1.051-6.353.617-11.868 3.733-12.325m-7.466 97.37c.556-6.399 3.558-11.396 6.712-11.16 3.138.236 5.233 5.622 4.677 12.029s-3.558 11.412-6.712 11.175c-3.145-.236-5.241-5.629-4.677-12.044m-23.287-43.886c.563-6.414 3.565-11.411 6.711-11.167 3.139.236 5.233 5.629 4.677 12.028-.556 6.406-3.565 11.412-6.704 11.168-3.146-.237-5.24-5.622-4.684-12.029m-11.671 43.947c1.066 6.354-.602 11.861-3.725 12.31-3.116.449-6.506-4.327-7.564-10.68-1.059-6.354.601-11.868 3.732-12.318 3.116-.456 6.49 4.335 7.557 10.688m-19.037-84.991c.61-6.407 3.649-11.389 6.795-11.137 3.131.259 5.195 5.659 4.602 12.066-.61 6.399-3.649 11.381-6.795 11.13-3.139-.259-5.195-5.661-4.602-12.059m298.184 307.279c-.19 6.795-5.751 12.203-12.554 12.203H36.268c-6.917-.015-12.531-5.622-12.547-12.546v-40.359h461.685zm2.133-77.017H23.874c-.053-.007-.099-.03-.152-.037v-56.388h464.26zm2.05-72.026H24.552l-.662-.747c-.053-.068-.115-.228-.168-.312v-15.434l-.038-.472a85 85 0 0 1-.274-7.214c-.016-13.247 2.574-31.019 8.997-50.848 6.414-19.845 16.629-41.799 31.758-63.807 13.301-19.38 32.254-34.821 51.459-45.219 9.59-5.203 19.219-9.149 28.086-11.754 8.86-2.613 16.988-3.855 23.31-3.848 6.041-.038 10.277 1.226 11.976 2.324l3.717 2.361c-18.816 16.271-35.217 44.77-35.217 86.082 0 55.876 45.989 68.91 71.988 68.91s71.988-13.034 71.988-68.91c0-6.239-.488-12.09-1.188-17.75l197.819 125.64.373.609.046.145zM177.266 170.856c-3.108.457-6.498-4.335-7.557-10.68-1.066-6.361.61-11.868 3.726-12.318 3.116-.457 6.506 4.326 7.572 10.68 1.051 6.36-.617 11.869-3.741 12.318" style={{ "fill": "#000" }} /></svg>,
    <svg className="size-6" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M40 2.047c-2.766 0-5.676 1.172-7.816 2.289a14.2 14.2 0 0 0-5.133.191c-1.149.262-2.301.711-3.219 1.528-.914.816-1.539 2.05-1.539 3.554v.97c-.152-.013-.363-.095-.508-.095-1.515 0-3.668.098-5.566 1.094-1.899.992-3.438 3.04-3.438 6.293v.66c-.32.004-.66-.043-.965.032-1.355.332-3.015.878-4.363 2.156C6.11 22 5.164 24.008 5.164 26.89v1.015c-.031.035-.059.024-.086.067-1.121 1.789-3.031 6.328-3.031 11.054 0 3.016.672 5.243 1.89 6.743 1.22 1.503 2.977 2.183 4.77 2.183 3.66 0 7.36-1.773 11.29-4.637 3.925-2.863 8.108-6.851 12.718-11.488C41.735 22.762 47.953 15.36 47.953 8c0-2.219-1.219-3.852-2.785-4.75-1.57-.902-3.461-1.203-5.168-1.203m0 1.906c1.469 0 3.078.3 4.219.953 1.136.649 1.828 1.516 1.828 3.094 0 6.242-5.73 13.484-14.688 22.484-4.586 4.614-8.722 8.543-12.488 11.29s-7.133 4.273-10.164 4.273c-1.34 0-2.437-.434-3.285-1.48-.852-1.044-1.469-2.81-1.469-5.54 0-3.953 1.672-8.035 2.563-9.609.234.027.511.07.898.145.941.175 2.223.453 3.555.687 1.336.234 2.719.434 3.937.453 1.219.02 2.364-.015 3.153-.93.402-.468.39-1.257.148-1.71s-.594-.762-1.012-1.067c-.836-.61-1.996-1.14-3.328-1.543-2.023-.61-4.453-.937-6.515-.262.265-1.363.722-2.425 1.418-3.086.968-.921 2.277-1.39 3.5-1.687.421-.102 1.539.012 2.847.36 1.309.343 2.844.859 4.363 1.331 1.516.47 3.016.895 4.356 1.043.668.075 1.305.086 1.91-.047.602-.132 1.203-.433 1.61-.964.417-.543.449-1.328.218-1.899-.23-.57-.625-1.023-1.117-1.46-.977-.868-2.375-1.645-3.953-2.239-1.574-.594-3.324-.988-4.996-.98a7.8 7.8 0 0 0-2.383.37c.402-1.253 1.031-2.167 1.98-2.667 1.395-.73 3.266-.875 4.68-.875.508 0 1.633.238 2.895.582 1.261.347 2.699.793 4.07 1.16 1.367.367 2.645.668 3.734.695.543.012 1.055-.023 1.563-.293s.91-.926.91-1.535c0-1.125-.672-2.059-1.535-2.738-.867-.684-1.969-1.184-3.176-1.54-1.894-.558-3.957-.609-5.824-.253.152-.387.375-.715.683-.992.567-.504 1.422-.872 2.372-1.09 1.898-.438 4.195-.25 4.695-.153l.328.063.3-.156c1.99-1.059 4.915-2.188 7.2-2.188M26.434 10.07c1.082.016 2.242.18 3.273.48 1.031.305 1.941.747 2.531 1.212.528.414.684.777.727 1.11-.098.023-.176.054-.434.046-.746-.02-1.968-.273-3.289-.629-1.32-.355-2.75-.797-4.055-1.156-.824-.227-1.457-.293-2.144-.41l.566-.23c.73-.298 1.739-.438 2.825-.423m-8.914 7.403c1.351-.008 2.914.332 4.316.855 1.402.527 2.644 1.25 3.352 1.879.355.316.558.613.613.746.02.043.023.031.027.035-.078.102-.2.188-.488.25-.3.067-.75.078-1.293.016-1.086-.117-2.516-.512-4.004-.973-1.488-.457-3.035-.98-4.441-1.351-.457-.121-.868-.192-1.29-.274l.114-.125c.668-.703 1.746-1.05 3.094-1.058M9.672 26.77c1.183-.036 2.476.16 3.64.511 1.168.352 2.192.848 2.762 1.262.04.027.028.031.063.059-.25.082-.465.203-1.2.195-1.027-.016-2.347-.2-3.636-.426-1.285-.23-2.551-.5-3.535-.683-.336-.067-.594-.102-.868-.141.707-.485 1.676-.742 2.774-.777" /></svg>,
    <svg className="size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path fillRule="evenodd" clipRule="evenodd" d="M2.924 10.207a9.3 9.3 0 0 0-.15 2.466l.066.054c.22.176.53.41.892.643.757.488 1.6.88 2.268.88.436 0 .964-.169 1.518-.448.337-.17.659-.367.943-.56a3.75 3.75 0 1 1 6.658.841c.222.107.452.167.686.167.463 0 .682-.22 1.117-.734l.032-.038c.361-.428.889-1.054 1.826-1.198a.75.75 0 0 1-.276-1.28l1.678-1.478a.75.75 0 0 1 .686-.163 9.2 9.2 0 0 0-.977-2.189l-.36.36a.75.75 0 1 1-1.061-1.06l.524-.524A9.23 9.23 0 0 0 12 2.75c-1.77 0-3.424.497-4.83 1.36l.36.36a.75.75 0 0 1-1.06 1.06l-.524-.524a9.3 9.3 0 0 0-2.377 3.182.75.75 0 0 1 .784.708l.079 1.412a.75.75 0 1 1-1.498.083zm18.23.458-1.659 1.46a.8.8 0 0 1-.2.127c.757.029 1.398.347 1.904.728a9.4 9.4 0 0 0-.045-2.315m-.303 4.032c-.442-.499-1.032-.947-1.667-.947-.463 0-.681.22-1.116.734l-.032.038c-.41.487-1.036 1.228-2.23 1.228-.708 0-1.316-.257-1.803-.58-.58.367-1.266.58-2.003.58a3.74 3.74 0 0 1-2.767-1.22c-.31.208-.664.423-1.04.612-.642.323-1.417.608-2.193.608-1.013 0-2.047-.488-2.82-.957a9.254 9.254 0 0 0 17.67-.096M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12m9.22-8.53a.75.75 0 0 1 1.06 0l1 1a.75.75 0 0 1-1.06 1.06l-1-1a.75.75 0 0 1 0-1.06m5.98.93a.75.75 0 0 1 .15 1.05l-1.5 2a.75.75 0 1 1-1.2-.9l1.5-2a.75.75 0 0 1 1.05-.15m-5.226 2.406a.75.75 0 0 1-.53.918l-1.366.366a.75.75 0 1 1-.388-1.448l1.366-.366a.75.75 0 0 1 .918.53m-5.327.368a.75.75 0 0 1 .993.372l.585 1.287a.75.75 0 0 1-1.365.621l-.586-1.287a.75.75 0 0 1 .373-.993m10.718 1.053a.75.75 0 0 1 .784.714l.066 1.413a.75.75 0 1 1-1.498.07l-.066-1.412a.75.75 0 0 1 .714-.785M12 9.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5m-5.057 1.145a.75.75 0 0 1 .162 1.048l-.835 1.141a.75.75 0 1 1-1.21-.886l.835-1.14a.75.75 0 0 1 1.048-.163" fill="#1c274c" /></svg>,
    <svg className="size-6" height="200" width="200" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000"><g id="SVGRepo_bgCarrier" strokeWidth="0" /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path className="st0" d="M512 159.234c0-2.486-.099-5.013-.264-7.572-1.338-19.604-9.365-38.366-22.279-54.682-19.471-24.542-49.628-44.335-88.802-58.389C361.433 24.586 312.961 16.411 256 16.404c-75.952.04-136.811 14.475-180.774 38.116-21.948 11.858-39.735 26.085-52.683 42.46C9.613 113.296 1.585 132.058.265 151.653A107 107 0 0 0 0 159.234c0 .924.116 1.792.133 2.708-.05 1.297-.133 2.617-.133 3.898-.033 13.757 2.857 26.382 8.291 37.126 4.046 8.06 9.447 14.979 15.574 20.619 9.232 8.472 19.934 14.104 30.718 17.762 4.013 1.355 8.059 2.379 12.089 3.237v229.874c0 5.566 2.246 11.015 6.193 14.945 3.931 3.94 9.381 6.194 14.946 6.194h336.378c5.566 0 10.999-2.254 14.946-6.194 3.931-3.93 6.193-9.38 6.193-14.945V244.633c2.824-.603 5.648-1.289 8.473-2.131 14.385-4.302 28.95-11.982 40.181-24.979 5.582-6.465 10.206-14.21 13.311-22.956 3.105-8.736 4.706-18.406 4.706-28.728 0-1.123-.083-2.287-.132-3.427.034-1.064.133-2.105.133-3.178m-53.476 25.648c-1.717 3.468-3.864 6.284-6.54 8.811-3.98 3.757-9.299 6.829-15.607 9.009-6.293 2.188-13.477 3.427-20.463 3.724-11.28.504-20.197 9.835-20.197 21.123v232.532h-294.1V227.548c0-11.288-8.918-20.619-20.198-21.123-6.209-.264-12.584-1.272-18.331-3.03-8.704-2.651-15.657-6.87-20.248-12.337-2.329-2.766-4.195-5.904-5.599-9.9-1.123-3.262-1.915-7.167-2.18-11.882l.05-1.182c.678-9.587 4.608-19.718 13.146-30.346 12.7-15.871 36.068-32.047 69.842-43.814 33.724-11.817 77.621-19.339 130.568-19.331 70.586-.05 125.086 13.443 160.857 32.394 17.902 9.438 31.048 20.181 39.553 30.751 8.522 10.628 12.453 20.76 13.146 30.338l.016.694c-.329 6.861-1.733 12.039-3.715 16.102" /><path className="st0" d="M225.002 211.587a10.56 10.56 0 0 0-10.57 10.57c0 5.846 4.723 10.57 10.57 10.57a10.56 10.56 0 0 0 10.57-10.57 10.56 10.56 0 0 0-10.57-10.57m110.981 71.873c0-8.762-7.101-15.854-15.854-15.854-8.77 0-15.855 7.093-15.855 15.854 0 8.752 7.085 15.854 15.855 15.854 8.753.001 15.854-7.101 15.854-15.854m-161.716 23.253c-7.002 0-12.684 5.68-12.684 12.684 0 7.002 5.682 12.684 12.684 12.684s12.684-5.682 12.684-12.684c0-7.003-5.681-12.684-12.684-12.684m175.456-150.088a10.564 10.564 0 0 0-10.57 10.57c0 5.838 4.723 10.57 10.57 10.57 5.83 0 10.57-4.732 10.57-10.57 0-5.839-4.74-10.57-10.57-10.57m-103.582-46.507c0-5.838-4.74-10.57-10.57-10.57a10.564 10.564 0 0 0-10.57 10.57c0 5.838 4.723 10.57 10.57 10.57 5.83 0 10.57-4.732 10.57-10.57" /><circle className="st0" cx="123.533" cy="158.739" r="6.342" /><circle className="st0" cx="157.356" cy="416.638" r="6.342" /><path className="st0" d="M340.21 391.006c-6.572 0-11.89 5.326-11.89 11.891 0 6.564 5.318 11.89 11.89 11.89 6.557 0 11.891-5.326 11.891-11.89.001-6.565-5.334-11.891-11.891-11.891m-92.534-9.487c-5.384 0-9.76 4.368-9.76 9.752s4.376 9.752 9.76 9.752 9.744-4.368 9.744-9.752c.001-5.384-4.359-9.752-9.744-9.752" /></g></svg>
];

const thirdPartValue: { [key: string]: { count: number, bg: string, text: string, icons: React.JSX.Element } } = {
    "cookies": { count: 10, bg: "#D7C5C2", text: "#4B1E1D", icons: icons[0] },
    "cake": { count: 10, bg: "#A4CFD3", text: "#1C676F", icons: icons[1] },
    "bretzel": { count: 10, bg: "#DFC7FF", text: "#3D2B58", icons: icons[2] },
    "pastries": { count: 10, bg: "#E8E8E6", text: "#353333", icons: icons[3] },
    "crossiant": { count: 10, bg: "#F5DF23", text: "#502205", icons: icons[4] },
    "bagel": { count: 10, bg: "#FFC9B3", text: "#742606", icons: icons[5] }
}

const productAccortion: { [key: string]: string } = {
    "bagel with seeds": "0.png",
    "cookies glucose": "2.png",
    "sliced piece bread": "3.png",
    "nutty biscuits": "4.png",
    "sweet rolls": "5.png",
    "bagel buns": "6.png",
}

const Home = () => {
    // const [scrolled, setScrolled] = useState(false);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         // You can adjust the scroll threshold (e.g., 100) to control when the effect triggers
    //         setScrolled(window.scrollY > 50);
    //     };

    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    const reccommendedPaddingClass = "mx-5 xl:mx-10"
    return (
        <main className="">
            <div className={`${reccommendedPaddingClass} hidden sm:block`}>
                <HeroCards />
            </div>
            {/* large card */}
            <div className={`${reccommendedPaddingClass} sm:hidden my-8  overflow-hidden rounded-[35px] bg-white px-5 py-7 shadow-[0_4px_10px_rgba(0,0,0,0.06)] sm:my-10 sm:rounded-[50px] sm:px-8 sm:py-8`}>

    {/* Heading */}
    <div className="relative">

        <p className="absolute left-[4%] top-1/2 -translate-y-1/2 -rotate-10 rounded-full bg-[#267847] px-2.5 py-1 font-title text-[9px] uppercase tracking-wide text-white sm:left-[8%] sm:px-3 sm:text-xs lg:left-[12%]">
            Tasty
        </p>

        <p className="absolute right-[4%] top-1/2 -translate-y-1/2 rotate-10 rounded-full bg-[#FF6E2E] px-2.5 py-1 font-title text-[9px] uppercase tracking-wide text-white sm:right-[8%] sm:px-3 sm:text-xs lg:right-[12%]">
            Crunchy
        </p>

        <h2 className="w-full text-center font-title text-[clamp(2.7rem,10vw,7rem)] font-extrabold uppercase leading-[0.85] tracking-[0.04em]">
            bake the cookies
        </h2>

    </div>


    {/* Content */}
    <div className="mt-8 flex flex-col relative items-center gap-8 sm:mt-10 lg:mt-[-25px] lg:flex-row lg:justify-around lg:gap-10">

        {/* Description */}
        <div className="flex w-full max-w-md flex-col gap-4 lg:w-auto lg:max-w-none relative z-[10]">

            <div className="relative mt-0 w-fit font-sub-title text-2xl font-thin uppercase leading-[1.15] sm:text-3xl lg:mt-20 lg:text-4xl">
                Premium bread
                <br />
                and cookies made
                <br />
                from scratch

                <p className="absolute -bottom-1 right-0 flex w-max rotate-10 items-center gap-1 rounded-full bg-[#17A7E4] px-2 py-1 font-text text-[10px] tracking-wider text-white sm:text-sm">
                    <span className="rounded-full bg-[#004A72] p-0.5" />
                    Fresh
                </p>
            </div>

            <p className="mt-1 max-w-sm font-text text-xs font-medium leading-5 sm:text-sm sm:leading-6">
                We are literally obsessed with giving
                <br className="" />
                more of what you love!
            </p>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-8">

                <BlobButton className="flex items-center gap-2 uppercase font-title text-xs tracking-wider sm:text-sm">
                    <span className="rounded-full bg-white p-1" />
                    Order Now
                </BlobButton>

                <button className="hidden sm:flex items-center gap-1 whitespace-nowrap uppercase font-title text-xs sm:text-sm">
                    Cooking blog
                    <ChevronRight strokeWidth={3} size={15} />
                </button>

            </div>

        </div>


        {/* Image */}
        <div className="sm:w-full max-w-[420px] lg:w-[45%] lg:max-w-[500px] sm:relative absolute w-[50%] bottom-0 right-0 z-[0]">

            <img
                src="/hero-card.png"
                alt=""
                className="mx-auto h-auto w-full object-contain"
            />

        </div>

    </div>

</div>
            {/* second part */}
            <SecondCard />

            {/* third part */}
            <div className={`${reccommendedPaddingClass}`}>
                <ThirdSection thirdPartValue={thirdPartValue} />
            </div>
            <div className="hidden grid grid-cols-[1fr_1fr] gap-10 items-center w-full py-15">
                <h2 className="text-7xl font-title flex w-full min-w-max">Product we bake<br /> here daily-</h2>
                <div className="space-y-3 w-full overflow-y-auto sidebar-none relative py-2">
                    <p className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#f8f4f0] to-transparent w-20" />
                    <p className="absolute top-0 right-0 h-full bg-gradient-to-l from-[#f8f4f0] to-transparent w-20" />

                    {/* row 1 */}
                    <div className="flex gap-5">
                        {Object.keys(thirdPartValue).map((value) => {
                            return <div key={value} className="text-base shadow-[0_4px_10px_rgba(0,0,0,0.06)] font-title px-5 py-2.5 rounded-full flex items-center gap-2" style={{ color: thirdPartValue[value].text, background: thirdPartValue[value].bg }}>
                                {value}
                                <span className="p-1 rounded-full px-2 text-white text-sm tracking-wider font-title" style={{ background: thirdPartValue[value].text }}>
                                    {thirdPartValue[value].count}
                                </span>
                            </div>
                        })}
                    </div>
                    {/* row 2 */}
                    <div className="flex gap-5">
                        {Object.keys(thirdPartValue).reverse().map((value) => {
                            return <div key={value} className="text-base shadow-[0_4px_10px_rgba(0,0,0,0.06)] font-title px-5 py-2.5 rounded-full flex items-center gap-2" style={{ color: thirdPartValue[value].text, background: thirdPartValue[value].bg }}>
                                {value}
                                <span className="p-1 rounded-full px-2 text-white text-sm tracking-wider font-title" style={{ background: thirdPartValue[value].text }}>
                                    {thirdPartValue[value].count}
                                </span>
                            </div>
                        })}
                    </div>
                </div >
            </div >
            {/* foor section */}
            <FourthSection productAccortion={productAccortion} />
            {/* made with hand */}
            <div className={`${reccommendedPaddingClass}`}>
                <FifthSection />
                {/* <div className="rounded-3xl bg-[#372321] px-10 py-5 mt-10 mb-20 w-full relative  grid grid-cols-2">
                    <img src="/card1.png" alt="" className="w-full" />
                    <div className="w-full px-10 tracking-wider my-10">
                        <p className="font-title text-white text-6xl">Made by hand from scratch with love</p>
                        <p className="font-text text-white text-lg leading-[20px] mt-10">Their experience plays a role in the way they work. Bakers use flavours.</p>
                        <div className="w-max mt-10">
                            <BlobButton className="uppercase font-title text-sm flex gap-2 items-center tracking-wider">
                                <span className="p-1 bg-white rounded-full" />
                                Order Now
                            </BlobButton>
                        </div>
                    </div>
                </div> */}
            </div>
            {/* bottom note */}
            <div className={`${reccommendedPaddingClass}`}>

                <div className="bg-[#A4CFD5] grid gap-10 sm:gap-0 sm:grid-cols-[1fr_auto_1fr] w-full px-10 py-10 rounded-3xl relative mb-10 overflow-hidden">
                    {/* cookie img right */}
                    <img src="/cookie1.png" alt="" className="w-50 absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 animate-[breathe_5s_linear_infinite]" />
                    {/* spiral top left rotating */}
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 animate-[spiral-rotate_10s_ease-in-out_infinite] -translate-y-1/4 -translate-x-1/4 size-40">
                        <g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1.45 15.29A11.73 11.73 0 0 1 13.17 3.56a9.38 9.38 0 0 1 9.38 9.38 7.5 7.5 0 0 1-7.5 7.5 6 6 0 0 1-6-6 4.8 4.8 0 0 1 4.8-4.8 3.84 3.84 0 0 1 3.84 3.84 3.07 3.07 0 0 1-3.07 3.07 2.46 2.46 0 0 1-2.46-2.45 2 2 0 0 1 2-2 1.57 1.57 0 0 1 1.54 1.6" style={{ "fill": "none", "stroke": "#F2F9B1", "strokeMiterlimit": "10", "strokeWidth": "1.92px" }} data-name="roll brush" />
                    </svg>
                    {/* left */}
                    <div className="w-full relative">
                        <p className="font-title text-[#005362] text-5xl ">With Enough <br /> butter, anything <br />is good!</p>
                        <div className="flex items-center mt-10">
                            <div className="bg-[#FEDA4F] rounded-full w-max">
                                <img src="/chef.png" alt="" className="h-15 " />
                            </div>
                            <p className="font-medium ml-10 font-text leading-[20px] text-[#005362]">Our Master plan to freshen<br />up a 200 year old</p>
                            <p className="underline font-medium ml-auto font-text mr-10 leading-[20px] cursor-pointer text-[#005362]">What we<br />are dishing out ?</p>
                        </div>
                    </div>
                    {/* divider */}
                    <div className="h-[90%] w-[2px] bg-[#589295] self-center" />
                    {/* right */}
                    <div className="w-full flex flex-col">
                        <div className="flex ml-10">
                            <p className="font-title text-5xl text-[#005362] mr-5">3.50</p>
                            <div className="flex flex-wrap items-center">
                                {[1, 2, 3, 4, 5].map((value) => {
                                    return <Star key={value} color="gold" strokeWidth={2} className="size-5 stroke-white" />
                                })}
                                <p className="w-full  text-[#005362] text-sm font-text font-semibold">Based on 10 reviews</p>
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className="mt-auto grid grid-cols-3 gap-3">
                            {["Plain Cake", "crossiant", "loaf bread", "Cookies", "bretzel", "apple pie"].map((value) => (
                                <BlobButton key={value} className="font-title text-sm text-[#005362]" stroke="#005362" fill="#A4CFD5">{value}</BlobButton>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
};

export default Home;





function SecondCard() {
    return (
        <div className="mx-5 grid grid-cols-1 items-center gap-12 py-10 sm:gap-14 sm:py-14 lg:grid-cols-2 lg:gap-10 lg:py-16 xl:gap-16">

    {/* LEFT — Hero Image */}
    <div className="relative mx-auto w-fit max-w-full">

        <div className="relative">

            <img
                src="/hero2.png"
                alt=""
                className="h-[clamp(20rem,70vw,27.5rem)] w-auto max-w-[85vw] object-contain lg:h-[31.25rem]"
            />

            {/* Circular Text */}
            <div className="absolute -left-5 top-4 sm:-left-7 sm:top-6 lg:-left-8 lg:top-8">
                <CircularText
                    text="Fun for the whole family "
                    className="left-1/2 top-0 -translate-x-1/2 bg-transparent text-[10px] uppercase sm:text-xs"
                />
            </div>

            {/* Small Decorative Sticker */}
            <div className="absolute -bottom-3 -right-4 rotate-[-7deg] rounded-full border-2 border-[var(--foreground)] bg-[#17a7e4] px-3 py-2 font-text text-[9px] font-bold uppercase tracking-wide shadow-[3px_4px_0px_rgba(0,0,0,0.12)] sm:-right-7 sm:px-5 sm:py-3 sm:text-xs">
                Baked with love ✦
            </div>

            {/* Decorative Star */}
            <span className="absolute -right-3 top-10 font-title text-3xl sm:-right-5 sm:top-14 sm:text-4xl">
                ✦
            </span>

        </div>
    </div>


    {/* RIGHT — Content */}
    <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:pl-4">

        {/* Main Heading */}
        <div className="font-title text-[clamp(2.8rem,10vw,4.5rem)] leading-[0.9]">

            <div className="flex items-center gap-2 sm:gap-3">

                <span>Your Only</span>

                <img
                    src="/cookie.png"
                    alt=""
                    className="size-10 shrink-0 animate-spin object-contain sm:size-14 lg:size-16 [animation-duration:5s]"
                />

            </div>

            <div className="mt-2">
                dose of delight
            </div>

        </div>


        {/* Featured Product */}
        <div className="mt-8 sm:mt-10">

            <p className="mb-3 font-text text-[10px] font-bold uppercase tracking-[0.1em] sm:text-xs">
                Featured Item
            </p>

            <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[var(--surface)] px-3 py-3 shadow-[4px_5px_0px_rgba(0,0,0,0.08)] sm:gap-4 sm:px-4">

                {/* Product Image */}
                <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#f3dfc3] sm:size-20">

                    <img
                        src="/crossiant.png"
                        alt="Bagel Buns"
                        className="h-12 w-auto object-contain sm:h-16"
                    />

                </div>

                {/* Product Name */}
                <div className="flex min-w-0 flex-1 flex-col font-text">

                    <span className="truncate text-base font-semibold leading-tight sm:text-xl">
                        Bagel Buns
                    </span>

                    <span className="mt-1 text-xs opacity-60 sm:text-sm">
                        Gluten Free
                    </span>

                </div>

                {/* Divider */}
                <div className="hidden h-9 w-px bg-[var(--foreground)]/20 sm:block" />

                {/* Price */}
                <span className="shrink-0 font-text text-xl font-semibold sm:text-2xl">
                    ₹40
                </span>

            </div>
        </div>


        {/* Fun Fact */}
        <div className="mt-7 max-w-md sm:mt-9">

            <div className="mb-2 flex items-center gap-2">

                <span className="text-base sm:text-lg">
                    ✦
                </span>

                <p className="font-text text-[10px] font-bold uppercase tracking-[0.1em] sm:text-xs">
                    Fun fact about bagels
                </p>

            </div>

            <p className="font-text text-xs leading-5 opacity-65 sm:text-sm sm:leading-6">
                Bagels are boiled before they're baked, giving them their
                signature chewy texture and deliciously crisp outside.
            </p>

        </div>

    </div>

</div>

    )
    {/* <div className="grid grid-cols-2 items-center py-10">
                <div className="mx-auto relative">
                    <div className="relative">

                        <img src="/hero2.png" alt="" className="h-110 " />
                        <div className="absolute top-10 -left-5">
                            <CircularText text="Fun for the whole family " className="uppercase bg-transparent top-0 left-1/2 -translate-x-1/2" />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="text-7xl font-title flex">Your Only <img src="/cookie.png" alt="" className="size-15 ml-5 animate-spin [animation-duration:5s]" /></div>
                    <div className="text-7xl font-title flex">dose of delight</div>
                    <p className="text-sm font-title my-5">Featured Item </p>
                    <div className="flex items-center gap-10">
                        <div className="bg-gray-300 py-2 rounded-xl px-3">
                            <img src="/crossiant.png" alt="" className="h-20" />
                        </div>
                        <p className="flex flex-col font-text font-semibold text-xl leading-[20px]">Bagel Buns <span className="font-text text-sm">Gluten Free</span></p>
                        <p className="h-7 w-[1px] bg-[var(--foreground)]" />
                        <p className="font-text font-semibold text-2xl">₹40</p>
                    </div>
                    <p className="text-xs uppercase font-text font-semibold mt-10">fun fact about bagel</p>
                    <p className="text-sm">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio, necessitatibus!</p>
                </div>
            </div> */}
}


// {/* <div className="grid grid-cols-[auto_1fr] gap-10 items-center w-full py-10">
//             <h2 className="text-6xl font-title flex min-w-max">Product we bake<br /> here daily-</h2>
//             <div className="space-y-3 w-full overflow-y-auto sidebar-none relative py-2">
//                 <p className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#f8f4f0] to-transparent w-20" />
//                 <p className="absolute top-0 right-0 h-full bg-gradient-to-l from-[#f8f4f0] to-transparent w-20" />
//                 {/* row 1 */}
// <div className="flex gap-5">
//     {Object.keys(thirdPartValue).map((value) => {
//         return <div key={value} className="text-base shadow-[0_4px_10px_rgba(0,0,0,0.06)] font-title px-5 py-2.5 rounded-full flex items-center gap-2" style={{ color: thirdPartValue[value].text, background: thirdPartValue[value].bg }}>
//             {value}
//             <span className="p-1 rounded-full px-2 text-white text-sm tracking-wider font-title" style={{ background: thirdPartValue[value].text }}>
//                 {thirdPartValue[value].count}
//             </span>
//         </div>
//     })}
// </div>
// {/* row 2 */ }
// <div className="flex gap-5">
//     {Object.keys(thirdPartValue).reverse().map((value) => {
//         return <div key={value} className="text-base shadow-[0_4px_10px_rgba(0,0,0,0.06)] font-title px-5 py-2.5 rounded-full flex items-center gap-2" style={{ color: thirdPartValue[value].text, background: thirdPartValue[value].bg }}>
//             {value}
//             <span className="p-1 rounded-full px-2 text-white text-sm tracking-wider font-title" style={{ background: thirdPartValue[value].text }}>
//                 {thirdPartValue[value].count}
//             </span>
//         </div>
//     })}
// </div>
//             </div >
//         </div > */}
