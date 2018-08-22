// Tên contract : File manager
// Mô tả: Dapp tích hợp uPort, IPFS, Oraclize trong contract để quản lý file phân tán
//--------------------------------------------------------------------------------------
pragma solidity ^0.4.23;

// import 2 thư viện cần dùng đó là strings.sol và oraclizeAPI.sol
// Mục đích để sử dụng oraclizeAPI và để nối chuỗi trong string
import "github.com/Arachnid/solidity-stringutils/strings.sol";
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

// Tạo contract kế thừa từ usingOraclize trong oraclizeAPI.sol
contract FileManager is usingOraclize {
    
    // Dùng các hàm trong import string
    using strings for *;
    
    // Khởi tạo biến chứa trị giá ETH / 1Gb
    uint public getPricePer1Gb = 1000000000000000000 wei; // 10^18 wei = 1 ether
    
    // Mỗi account lần đầu sử dụng se được tặng 50Mb free
    uint public firstFreeSpace = 50*(1024**2); //50Mb
    
    // Khởi tạo biến chưa địa chỉ của owner sở hữu contract
    address owner;
    
    // Tạo các event để ghi lại log các hành động cần lưu
    event logConstructorInitiated(string text, address owner);
    event logPriceUpdated(uint getPricePer1Gb);
    event logNewOraclizeQuery(string description);

    // Tạo 2 mapping để lưu trữ các user và danh sách file của user
    mapping (address => user) listUser;
    mapping (address => uint) listTotalSize;

    // Tạo struct chứa các thông tin cần thiết của user
    struct user{
        uint spaceUsed;
        uint totalSize;
        uint num_of_files;
        uint eTH_Contributed;
        mapping (uint => file) listFile;
    }

    // Tạo struct chứa thông tin file lưu trữ
    struct file{
        string fileName;
        string fileHash;
        uint timeStamp;
    }

    // Contructor khi deployed sẽ gán owner bằng địa chỉ của sender
    function FileManager() public payable{
        owner = msg.sender;
        logConstructorInitiated("Constructor was initiated and owner is: ", owner);
    }

    // Hàm modifier xét điều kiện là sender là owner thì sẽ thực thi các hàm gọi hàm ownerAuthority
    modifier ownerAuthority(){
       require(msg.sender == owner);
       _;
    }
    
    // Hàm này dùng thay đổi owner của contract
    function changeOwner(address _newOwner) public ownerAuthority
    {
        owner = _newOwner;
    }

    // Hàm dùng để rút tiền trong smart contract
    function withdrawal() public ownerAuthority{
        suicide(owner);
    }
    
    //------------------------------------------ORACLIZE---------------------------------------------------------------

    function __callback(bytes32 myid, string result) {
       if (msg.sender != oraclize_cbAddress()) revert();
       getPricePer1Gb = parseInt(result);
       logPriceUpdated(getPricePer1Gb);
   }

    function updatePrice() public payable ownerAuthority{
        if (oraclize_getPrice("URL") > this.balance) {
            logNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        }else {
            logNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
            oraclize_query("URL", "json(https://nhonnh9939.000webhostapp.com/).price");
        }
    }

    //--------------------------------------------IPFS---------------------------------------------------------------

    // Hàm dùng để lưu file hash và các thông tin khác của user
    function uploadFile(uint _FileSize, string _FileHash, string _FileName) public {
        require(bytes(_FileName).length > 0);
        require(bytes(_FileHash).length > 0);
        require(_FileSize > 0);
        if(listUser[msg.sender].totalSize == 0)
            listUser[msg.sender].totalSize = firstFreeSpace;
        require((listUser[msg.sender].spaceUsed + _FileSize) <= listUser[msg.sender].totalSize);
        listUser[msg.sender].listFile[listUser[msg.sender].num_of_files] = file({
            fileName: _FileName,
            fileHash: _FileHash,
            timeStamp: now
        });
        listUser[msg.sender].spaceUsed = listUser[msg.sender].spaceUsed + _FileSize;
        listUser[msg.sender].num_of_files = listUser[msg.sender].num_of_files + 1;
    }
    
    // Hàm mua dung lượng data
    function buyData() public payable{
        require(msg.value >= 0.01 ether);
        uint temp = ((msg.value)*(1024**3))/getPricePer1Gb;
        listUser[msg.sender].totalSize = listUser[msg.sender].totalSize + temp;
        listUser[msg.sender].eTH_Contributed = listUser[msg.sender].eTH_Contributed + msg.value;  
    }
    
    // Các hàm get này để lấy thông tin của user
    function getSpaceUsed(address _sender) public view returns(uint) {
        return listUser[_sender].spaceUsed;
    }
    function getTotalSize(address _sender) public view returns(uint) {
        if (listUser[_sender].totalSize == 0)
            return firstFreeSpace;
        return listUser[_sender].totalSize;
    }
    function getETH_Contributed(address _sender) public view returns(uint) {
        return listUser[_sender].eTH_Contributed;
    }
    function getFile(address _sender) public view returns(string list_hash)
    {
        uint i = 0;
        for (i=0; i< listUser[_sender].num_of_files ; i++){
            string storage file_hash = listUser[_sender].listFile[i].fileHash;
            list_hash = list_hash.toSlice().concat(file_hash.toSlice());
        }
    }
}