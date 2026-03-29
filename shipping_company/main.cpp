#include <iostream>
#include <vector>
#include <string>
#include <windows.h>

using namespace std;

// ----------------------
// 1. ИЕРАРХИЯ НАСЛЕДОВАНИЯ
// ----------------------

class Transport
{
protected:
    string name;

public:
    Transport(const string &name) : name(name) {}

    virtual void info() const
    {
        cout << "Транспорт: " << name << endl;
    }

    string getName() const
    {
        return name;
    }

    virtual ~Transport() = default;
};

class WaterTransport : public Transport
{
protected:
    double displacement;

public:
    WaterTransport(const string &name, double displacement)
        : Transport(name), displacement(displacement) {}

    void info() const override
    {
        cout << "Водный транспорт: " << name
             << ", водоизмещение: " << displacement << " т" << endl;
    }
};

class CrewMember;

class Ship : public WaterTransport
{
public:
    // ----------------------
    // КОМПОЗИЦИЯ
    // ----------------------
    class Engine
    {
    private:
        int power;

    public:
        Engine(int power) : power(power) {}

        void start() const
        {
            cout << "Двигатель запущен. Мощность: " << power << " л.с." << endl;
        }

        int getPower() const
        {
            return power;
        }
    };

    class Cabin
    {
    private:
        int seats;

    public:
        Cabin(int seats) : seats(seats) {}

        void showCabinInfo() const
        {
            cout << "Каюта рассчитана на " << seats << " человек." << endl;
        }
    };

protected:
    Engine engine;
    Cabin cabin;

    // ----------------------
    // АГРЕГАЦИЯ
    // ----------------------
    vector<CrewMember *> crew;

public:
    Ship(const string &name, double displacement, int enginePower, int cabinSeats)
        : WaterTransport(name, displacement),
          engine(enginePower),
          cabin(cabinSeats) {}

    void addCrewMember(CrewMember *member)
    {
        crew.push_back(member);
    }

    void showCrew() const;

    void startShip() const
    {
        engine.start();
    }

    void showCabin() const
    {
        cabin.showCabinInfo();
    }

    void info() const override
    {
        cout << "Корабль: " << name
             << ", водоизмещение: " << displacement
             << " т, мощность двигателя: " << engine.getPower() << " л.с." << endl;
    }
};

class CargoShip : public Ship
{
private:
    double cargoCapacity;

public:
    CargoShip(const string &name, double displacement, int enginePower,
              int cabinSeats, double cargoCapacity)
        : Ship(name, displacement, enginePower, cabinSeats),
          cargoCapacity(cargoCapacity) {}

    void info() const override
    {
        cout << "Грузовое судно: " << name
             << ", водоизмещение: " << displacement
             << " т, грузоподъемность: " << cargoCapacity
             << " т" << endl;
    }
};

// ----------------------
// СОТРУДНИКИ
// ----------------------

class Employee
{
protected:
    string fullName;

public:
    Employee(const string &fullName) : fullName(fullName) {}

    virtual void work() const
    {
        cout << fullName << " выполняет работу." << endl;
    }

    string getFullName() const
    {
        return fullName;
    }

    virtual ~Employee() = default;
};

class CrewMember : public Employee
{
public:
    CrewMember(const string &fullName) : Employee(fullName) {}

    void work() const override
    {
        cout << fullName << " работает в составе экипажа." << endl;
    }
};

class Captain : public CrewMember
{
public:
    Captain(const string &fullName) : CrewMember(fullName) {}

    void work() const override
    {
        cout << fullName << " управляет судном как капитан." << endl;
    }
};

void Ship::showCrew() const
{
    cout << "Экипаж корабля " << name << ":" << endl;
    for (const auto *member : crew)
    {
        cout << "- " << member->getFullName() << endl;
    }
}

// ----------------------
// АССОЦИАЦИЯ
// ----------------------

class Port
{
private:
    string title;

public:
    Port(const string &title) : title(title) {}

    string getTitle() const
    {
        return title;
    }
};

class Voyage
{
private:
    string voyageNumber;
    Port *departurePort;
    Port *arrivalPort;

public:
    Voyage(const string &voyageNumber, Port *departurePort, Port *arrivalPort)
        : voyageNumber(voyageNumber),
          departurePort(departurePort),
          arrivalPort(arrivalPort) {}

    void showVoyage() const
    {
        cout << "Рейс " << voyageNumber << ": "
             << departurePort->getTitle() << " -> "
             << arrivalPort->getTitle() << endl;
    }
};

// ----------------------
// ДЕЛЕГИРОВАНИЕ
// ----------------------

class FleetRegistry
{
private:
    vector<Ship *> ships;

public:
    void addShip(Ship *ship)
    {
        ships.push_back(ship);
    }

    Ship *findByName(const string &shipName) const
    {
        for (auto *ship : ships)
        {
            if (ship->getName() == shipName)
            {
                return ship;
            }
        }
        return nullptr;
    }

    void showAllShips() const
    {
        cout << "Флот компании:" << endl;
        for (auto *ship : ships)
        {
            ship->info();
        }
    }
};

class ShippingCompany
{
private:
    string companyName;
    FleetRegistry registry;

public:
    ShippingCompany(const string &companyName) : companyName(companyName) {}

    void addShip(Ship *ship)
    {
        registry.addShip(ship);
    }

    Ship *findShipByName(const string &shipName) const
    {
        return registry.findByName(shipName); // делегирование
    }

    void showFleet() const
    {
        cout << "Судоходная компания: " << companyName << endl;
        registry.showAllShips();
    }
};

// ----------------------
// MAIN
// ----------------------

int main()
{
    // Исправление кодировки
    SetConsoleOutputCP(65001);
    SetConsoleCP(65001);
    setlocale(LC_ALL, "");

    // Порты
    Port spb("Санкт-Петербург");
    Port kaliningrad("Калининград");

    // Рейс
    Voyage voyage1("V-101", &spb, &kaliningrad);

    // Экипаж
    Captain captain("Иван Петров");
    CrewMember sailor1("Алексей Смирнов");
    CrewMember sailor2("Дмитрий Волков");

    // Корабль
    CargoShip ship1("Балтика", 12000, 5000, 20, 8000);

    ship1.addCrewMember(&captain);
    ship1.addCrewMember(&sailor1);
    ship1.addCrewMember(&sailor2);

    // Компания
    ShippingCompany company("МорЛогистик");
    company.addShip(&ship1);

    // Вывод
    cout << "=== Информация о флоте ===" << endl;
    company.showFleet();

    cout << "\n=== Экипаж судна ===" << endl;
    ship1.showCrew();

    cout << "\n=== Композиция ===" << endl;
    ship1.startShip();
    ship1.showCabin();

    cout << "\n=== Ассоциация ===" << endl;
    voyage1.showVoyage();

    cout << "\n=== Делегирование ===" << endl;
    Ship *found = company.findShipByName("Балтика");
    if (found)
    {
        cout << "Судно найдено: ";
        found->info();
    }

    cout << "\n=== Работа сотрудников ===" << endl;
    captain.work();
    sailor1.work();

    return 0;
}