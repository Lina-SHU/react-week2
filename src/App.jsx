import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

function App() {
  const { VITE_APP_BASEURL, VITE_APP_APIPATH } = import.meta.env;
  const [formData, setFormData] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([
    {
        category: "甜甜圈",
        content: "尺寸：14x14cm",
        description: "濃郁的草莓風味，中心填入滑順不膩口的卡士達內餡，帶來滿滿幸福感！",
        id: "-L9tH8jxVb2Ka_DYPwng",
        is_enabled: 1,
        origin_price: 150,
        price: 99,
        title: "草莓莓果夾心圈",
        unit: "元",
        num: 10,
        imageUrl: "https://images.unsplash.com/photo-1583182332473-b31ba08929c8",
        imagesUrl: [
            "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a",
            "https://images.unsplash.com/photo-1559656914-a30970c1affd"
        ]
    },
    {
        category: "蛋糕",
        content: "尺寸：6寸",
        description: "蜜蜂蜜蛋糕，夾層夾上酸酸甜甜的檸檬餡，清爽可口的滋味讓人口水直流！",
        id: "-McJ-VvcwfN1_Ye_NtVA",
        is_enabled: 1,
        origin_price: 1000,
        price: 900,
        title: "蜂蜜檸檬蛋糕",
        unit: "個",
        num: 1,
        imageUrl: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80",
        imagesUrl: [
            "https://images.unsplash.com/photo-1618888007540-2bdead974bbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=987&q=80",
        ]
    },
    {
        category: "蛋糕",
        content: "尺寸：6寸",
        description: "法式煎薄餅加上濃郁可可醬，呈現經典的美味及口感。",
        id: "-McJ-VyqaFlLzUMmpPpm",
        is_enabled: 1,
        origin_price: 700,
        price: 600,
        title: "暗黑千層",
        unit: "個",
        num: 15,
        imageUrl: "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
        imagesUrl: [
            "https://images.unsplash.com/flagged/photo-1557234985-425e10c9d7f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA5fHxjYWtlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
            "https://images.unsplash.com/photo-1540337706094-da10342c93d8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDR8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"
        ]
    }
  ]);
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

  const userlogin = async () => {
    try {
      const res = await axios.post(`${VITE_APP_BASEURL}/admin/signin`, formData);
      const { token, expired } = res.data;
      document.cookie = `coupont=${token}; expires=${new Date(expired)}; path=/`;
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='container'>
        {
          isAuth ? (<>
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
              <div className="mb-3">
                <label htmlFor="username" className="form-label">信箱</label>
                <input id="username" type="email" name="username" className="form-control" placeholder="請輸入信箱" onChange={(e) => handleInput(e)} />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">密碼</label>
                <input type="password" className="form-control" name="password" id="password" placeholder="請輸入密碼" onChange={(e) => handleInput(e)} />
              </div>
              <button type="button" className="btn btn-primary w-100" onClick={userlogin}>登入</button>
            </div>
          </div>
          </>)
        }
      </div>
    </>
  )
}

export default App
