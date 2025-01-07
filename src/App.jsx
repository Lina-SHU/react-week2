import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

function App() {
  const { VITE_BASE_URL, VITE_API_PATH } = import.meta.env;
  const [formData, setFormData] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState({});

  const modalRef = useRef(null);
  const productModal = useRef(null);

  useEffect(() => {
    if (!isAuth) return;
    productModal.current = new Modal(modalRef.current);
  }, [isAuth]);

  const openModal = (prd) => {
    setTempProduct(prd);
    productModal.current.show();
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  };

  // 登入
  const userlogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${VITE_BASE_URL}/admin/signin`, formData);
      const { token, expired } = res.data;
      document.cookie = `coupont=${token}; expires=${new Date(expired)}; path=/`;
      setIsAuth(true);
      axios.defaults.headers.common['Authorization'] = token;
      getProducts();
      alert('登入成功');
    } catch (error) {
      console.error(error);
    }
  };

  // 檢查使用者是否登入
  const checkUserLogin = async () => {
    try {
      await axios.post(`${VITE_BASE_URL}/api/user/check`);
      setIsAuth(true);
      getProducts();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)coupont\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common['Authorization'] = token;
    checkUserLogin();
  }, []);

  // 取得產品列表
  const getProducts = async () => {
    try {
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PATH}/admin/products`);
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  // 登出
  const userLogout = async () => {
    try {
      await axios.post(`${VITE_BASE_URL}/logout`);
      setIsAuth(false);
      alert('登出成功');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className='container'>
        {
          isAuth ? (<>
            <div className='text-end mt-5'>
              <button type='button' className="btn btn-outline-primary btn-sm" onClick={userLogout}>登出</button>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                </tr>
                </thead>
                <tbody>
                    {
                      products.map((prd) => {
                            return (
                                <tr key={prd.id}>
                                    <td className="align-middle">{ prd.title }</td>
                                    <td className="align-middle">{ prd.origin_price }</td>
                                    <td className="align-middle">{ prd.price }</td>
                                    <td className="align-middle">{ prd.is_enabled ?  <span className="text-success">啟用</span> : <span className="text-danger">未啟用</span> }</td>
                                    <td>
                                        <button type="button" className="btn btn-primary" onClick={() => openModal(prd)}>查看細節</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            {/* Modal */}
            <div ref={modalRef} className="modal fade" id="detailModal">
                  <div className="modal-dialog modal-lg">
                      <div className="modal-content">
                          <div className="modal-header">
                              <h2 className="modal-title fs-5" id="exampleModalLabel">
                                  { tempProduct.title }
                                  <span className="badge bg-primary ms-2">{ tempProduct.category }</span>
                              </h2>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body">
                              <div className="row">
                                  <div className="col-lg-6">
                                      <img src={tempProduct.imageUrl} alt={tempProduct.title} className="img-fluid object-fit-cover" />
                                  </div>
                                  <div className="col-lg-6">
                                      <p>商品描述：{ tempProduct.description }</p>
                                      <p>商品內容：{ tempProduct.content }</p>
                                      <div className="d-flex">
                                          <del>{ tempProduct.origin_price }</del>
                                          元 / { tempProduct.price } 元
                                      </div>
                                  </div>
                              </div>
                              <h5 className="mt-3">更多圖片</h5>
                              <div className="d-flex flex-wrap">
                                  {
                                      tempProduct.title && tempProduct.imagesUrl.map((img, index) => {
                                          return (<img key={index} src={img} alt={index} className="object-fit-cover w-50" />)
                                      })
                                  }
                              </div>
                          </div>
                          <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                          </div>
                      </div>
                  </div>
              </div>
          </>) : (<>
          <div className='row justify-content-center mt-5'>
            <div className='col-md-10 col-lg-6'>
              <h3 className="text-center">請先登入</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">信箱</label>
                  <input id="username" type="email" name="username" className="form-control" placeholder="請輸入信箱" onChange={(e) => handleInput(e)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">密碼</label>
                  <input type="password" className="form-control" name="password" id="password" placeholder="請輸入密碼" onChange={(e) => handleInput(e)} />
                </div>
                <button type="submit" className="btn btn-primary w-100" onClick={(e) => userlogin(e)}>登入</button>
              </form>
            </div>
          </div>
          </>)
        }
      </div>
    </>
  )
}

export default App
