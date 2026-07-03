package com.softcommerce.views.uipaneltfaduana;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.AbstractRegister;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.CTable;
import java.awt.BorderLayout;
import java.awt.Component;
import javax.swing.JScrollPane;
import javax.swing.event.ListSelectionEvent;
import javax.swing.table.TableRowSorter;
import com.softcommerce.reglasnegocio.rn_Aduana;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.View;
import java.awt.CardLayout;
import javax.swing.event.ListSelectionListener;
import java.awt.event.ActionListener;
import java.awt.event.FocusListener;
import java.awt.event.ActionEvent;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import javax.swing.Icon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.border.BevelBorder;
import com.softcommerce.iconos.Gif;
import com.softcommerce.general.controles.Register;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import javax.swing.JButton;
import javax.swing.SwingConstants;
import javax.swing.border.EmptyBorder;
import com.softcommerce.general.tablas.AduanaTableModel;
import com.softcommerce.util.ExportExcel;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JOptionPane;

public class UiPanelTFAduana 
        extends JHInternalFrame 
        implements InterUiPanelTFAduana, ListSelectionListener, FocusListener, ActionListener {

    public CTable table;
    public AduanaTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    public JScrollPane scroll;
    private JLabel lblTitle;
    private final AbstractRegister register;
    private final Usuario usuario;
    private JButton cbFirst;
    private JButton cbPrevius;
    private JButton cbNext;
    private JButton cbLast;
    private JButton cbAdd;
    private JButton cbModify;
    private JButton cbEliminate;
    private JButton cbDetails;
    private JButton cbSearch;
    private JButton cbPrint;
    private JButton cbPrintFast;
    private JButton cbClose;
    private JButton cbRefresh;
    private JButton cbNullify;
    private JButton cbClone;
    private JButton cbReport;

    public UiPanelTFAduana(AbstractRegister areg, String title, JFrame frm, Usuario usuario) {
        super(title);
        register = areg;
        register.setTitleName(title);
        register.setView((View) this);
        register.setRowSelection((RowSelection) this);
        this.usuario = usuario;
        inicialize();
    }

    public UiPanelTFAduana(AbstractRegister areg, String title, JFrame frm, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        register = areg;
        register.setTitleName(title);
        register.setView((View) this);
        register.setRowSelection((RowSelection) this);
        this.usuario = usuario;
        inicialize( vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
    }

    private void inicialize() {
        Gif gif = new Gif();

        CardLayout cardView = new CardLayout();
        JPanel pnlCardView = new JPanel(cardView);
        pnlCardView.setBorder(new BevelBorder(1));
        pnlCardView.setOpaque(false);

        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());

        /*JPanel pnlRow = new JPanel();
        pnlRow.setOpaque(false);
        pnlRow.setLayout(new FlowLayout(FlowLayout.LEFT));
        pnlRow.setBackground(new Color(236, 233, 216));
        pnlRow.setBorder(new EmptyBorder(0, 145, 0, 0));

        int a = 25, h = 20;

        lblRegister = new JLabel("Registro: ");
        lblRegister.setOpaque(false);
        pnlRow.add(lblRegister);

        cbFirst = new JButton(gif.FIRST);
        cbFirst.setPreferredSize(new Dimension(a, h));
        cbFirst.setToolTipText("Primer registro");
        cbFirst.addActionListener(this);
        cbFirst.setOpaque(false);
        pnlRow.add(cbFirst);

        cbPrevius = new JButton(gif.PREVIUS);
        cbPrevius.setPreferredSize(new Dimension(a, h));
        cbPrevius.setToolTipText("Registro anterior");
        cbPrevius.addActionListener(this);
        cbPrevius.setOpaque(false);
        pnlRow.add(cbPrevius);

        txtRow = new JTextField();
        txtRow.setPreferredSize(new Dimension(80, h - 2));
        txtRow.setHorizontalAlignment(SwingConstants.RIGHT);
        pnlRow.add(txtRow);

        cbNext = new JButton(gif.NEXT);
        cbNext.setPreferredSize(new Dimension(a, h));
        cbNext.setToolTipText("Registro siguiente");
        cbNext.addActionListener(this);
        cbNext.setOpaque(false);
        pnlRow.add(cbNext);

        cbLast = new JButton(gif.LAST);
        cbLast.setPreferredSize(new Dimension(a, h));
        cbLast.setToolTipText("Último registro");
        cbLast.addActionListener(this);
        cbLast.setOpaque(false);
        pnlRow.add(cbLast);

        lblRowCount = new JLabel("de ");
        lblRowCount.setOpaque(false);
        pnlRow.add(lblRowCount);

        //pnl.add(pnlRow, BorderLayout.SOUTH);

        */
        JPanel pnlControl = new JPanel();
        pnlControl.setLayout(new BorderLayout());
        pnlControl.setOpaque(false);
        pnlControl.setPreferredSize(new Dimension(150, 0));

        int an = 120, ha = 30, s = 10;

        JPanel pnlNorth = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 5));

        cbAdd = new JButton("Agregar", gif.ADD16);
        cbAdd.setPreferredSize(new Dimension(an, ha));
        cbAdd.setHorizontalAlignment(SwingConstants.LEFT);
        cbAdd.setMnemonic('A');
        cbAdd.addActionListener(this);
        cbAdd.setOpaque(false);
        cbAdd.setIconTextGap(s);
        pnlNorth.add(cbAdd);

        cbModify = new JButton("Modificar", gif.MODIFY16);
        cbModify.setPreferredSize(new Dimension(an, ha));
        cbModify.setHorizontalAlignment(SwingConstants.LEFT);
        cbModify.setMnemonic('M');
        cbModify.addActionListener(this);
        cbModify.setOpaque(false);
        cbModify.setIconTextGap(s);
        pnlNorth.add(cbModify);

        cbEliminate = new JButton("Eliminar", gif.ELIMINATE16);
        cbEliminate.setPreferredSize(new Dimension(an, ha));
        cbEliminate.setHorizontalAlignment(SwingConstants.LEFT);
        cbEliminate.setMnemonic('E');
        cbEliminate.addActionListener(this);
        cbEliminate.setOpaque(false);
        cbEliminate.setIconTextGap(s);
        pnlNorth.add(cbEliminate);

        cbNullify = new JButton("Anular", gif.NULLIFY);
        cbNullify.setPreferredSize(new Dimension(an, ha));
        cbNullify.setHorizontalAlignment(SwingConstants.LEFT);
        cbNullify.setMnemonic('N');
        cbNullify.addActionListener(this);
        cbNullify.setOpaque(false);
        cbNullify.setIconTextGap(s);
        pnlNorth.add(cbNullify);

        cbClone = new JButton("Clonar", gif.CLONE);
        cbClone.setPreferredSize(new Dimension(an, ha));
        cbClone.setHorizontalAlignment(SwingConstants.LEFT);
        cbClone.setMnemonic('N');
        cbClone.addActionListener(this);
        cbClone.setOpaque(false);
        cbClone.setIconTextGap(s);
        pnlNorth.add(cbClone);

        cbDetails = new JButton("Detalle", gif.DETAIL16);
        cbDetails.setPreferredSize(new Dimension(an, ha));
        cbDetails.setHorizontalAlignment(SwingConstants.LEFT);
        cbDetails.setMnemonic('Z');
        cbDetails.addActionListener(this);
        cbDetails.setOpaque(false);
        cbDetails.setIconTextGap(s);
        pnlNorth.add(cbDetails);

        cbSearch = new JButton("Buscar", gif.SEARCH16);
        cbSearch.setPreferredSize(new Dimension(an, ha));
        cbSearch.setHorizontalAlignment(SwingConstants.LEFT);
        cbSearch.setMnemonic('B');
        cbSearch.addActionListener(this);
        cbSearch.setOpaque(false);
        cbSearch.setIconTextGap(s);
        pnlNorth.add(cbSearch);

        cbReport = new JButton("Reporte", gif.REPORT16);
        cbReport.setPreferredSize(new Dimension(an, ha));
        cbReport.setHorizontalAlignment(SwingConstants.LEFT);
        cbReport.setMnemonic('R');
        cbReport.addActionListener(this);
        cbReport.setOpaque(false);
        cbReport.setIconTextGap(s);
        pnlNorth.add(cbReport);

        cbPrint = new JButton("Imprimir", gif.PRINT16);
        cbPrint.setPreferredSize(new Dimension(an, ha));
        cbPrint.setHorizontalAlignment(SwingConstants.LEFT);
        cbPrint.setMnemonic('I');
        cbPrint.addActionListener(this);
        cbPrint.setOpaque(false);
        cbPrint.setIconTextGap(s);
        pnlNorth.add(cbPrint);

        cbPrintFast = new JButton("Imp. Directa", gif.PRINT16);
        cbPrintFast.setPreferredSize(new Dimension(an, ha));
        cbPrintFast.setHorizontalAlignment(SwingConstants.LEFT);
        cbPrintFast.setMnemonic('F');
        cbPrintFast.addActionListener(this);
        cbPrintFast.setOpaque(false);
        cbPrintFast.setIconTextGap(s);
        pnlNorth.add(cbPrintFast);

        cbClose = new JButton("Cerrar", gif.EXIT16);
        cbClose.setPreferredSize(new Dimension(an, ha));
        cbClose.setHorizontalAlignment(SwingConstants.LEFT);
        cbClose.setMnemonic('S');
        cbClose.addActionListener(this);
        cbClose.setOpaque(false);
        cbClose.setIconTextGap(s);
        pnlNorth.add(cbClose);

        pnlControl.add(pnlNorth, BorderLayout.CENTER);

        JPanel pnlSouth = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 5));

        cbRefresh = new JButton("Refrescar", gif.REFRESH16);
        cbRefresh.setPreferredSize(new Dimension(an, ha));
        cbRefresh.setHorizontalAlignment(SwingConstants.LEFT);
        cbRefresh.setMnemonic('R');
        cbRefresh.addActionListener(this);
        cbRefresh.setOpaque(false);
        cbRefresh.setIconTextGap(s);
        pnlSouth.add(cbRefresh);

        pnlControl.add(pnlSouth, BorderLayout.SOUTH);

        pnl.add(pnlControl, BorderLayout.WEST);

        JPanel pnlaux = new JPanel(new BorderLayout());
        pnlaux.setLayout(new BorderLayout(0, 0));

        modeltable = new AduanaTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();

        table.getSelectionModel().addListSelectionListener(this);
        table.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == 127) {
                    //controlEliminate();
                } else {
                    e.getKeyCode();
                }
            }
        });

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    controlDetails();
                }
            }
        });

        scroll = new JScrollPane(table);

        pnlaux.add(scroll, BorderLayout.CENTER);
        pnl.add(pnlaux, BorderLayout.CENTER);

        lblTitle = new JLabel();
        lblTitle.setOpaque(true);
        lblTitle.setFont(new Font(lblTitle.getFont().getFontName(), 1, 14));
        lblTitle.setForeground(new Color(214, 223, 245));
        lblTitle.setBackground(new Color(117, 140, 220));
        lblTitle.setPreferredSize(new Dimension(0, 25));
        lblTitle.setBorder(new EmptyBorder(0, 10, 0, 0));
        pnl.add(lblTitle, BorderLayout.NORTH);

        pnlCardView.add("pnlPrincipal", pnl);
        setPanel(pnlCardView);
    }

    private void inicialize(boolean swAdd, boolean swModify, boolean swEliminate, boolean swNullify, boolean swClone, boolean swDetails, boolean swSearch, boolean swReport, boolean swExport, boolean swPrint, boolean swPrintFast, boolean swClose, boolean swRefresh) {
        Gif gif = new Gif();

        CardLayout cardView = new CardLayout();
        JPanel pnlCardView = new JPanel(cardView);
        pnlCardView.setBorder(new BevelBorder(1));
        pnlCardView.setOpaque(false);

        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());

        /*JPanel pnlRow = new JPanel();
        pnlRow.setOpaque(false);
        pnlRow.setLayout(new FlowLayout(FlowLayout.LEFT));
        pnlRow.setBackground(new Color(236, 233, 216));
        pnlRow.setBorder(new EmptyBorder(0, 145, 0, 0));

        int a = 25, h = 20;

        lblRegister = new JLabel("Registro: ");
        lblRegister.setOpaque(false);
        pnlRow.add(lblRegister);

        cbFirst = new JButton(gif.FIRST);
        cbFirst.setPreferredSize(new Dimension(a, h));
        cbFirst.setToolTipText("Primer registro");
        cbFirst.addActionListener(this);
        cbFirst.setOpaque(false);
        pnlRow.add(cbFirst);

        cbPrevius = new JButton(gif.PREVIUS);
        cbPrevius.setPreferredSize(new Dimension(a, h));
        cbPrevius.setToolTipText("Registro anterior");
        cbPrevius.addActionListener(this);
        cbPrevius.setOpaque(false);
        pnlRow.add(cbPrevius);

        txtRow = new JTextField();
        txtRow.setPreferredSize(new Dimension(80, h - 2));
        txtRow.setHorizontalAlignment(SwingConstants.RIGHT);
        pnlRow.add(txtRow);

        cbNext = new JButton(gif.NEXT);
        cbNext.setPreferredSize(new Dimension(a, h));
        cbNext.setToolTipText("Registro siguiente");
        cbNext.addActionListener(this);
        cbNext.setOpaque(false);
        pnlRow.add(cbNext);

        cbLast = new JButton(gif.LAST);
        cbLast.setPreferredSize(new Dimension(a, h));
        cbLast.setToolTipText("Último registro");
        cbLast.addActionListener(this);
        cbLast.setOpaque(false);
        pnlRow.add(cbLast);

        lblRowCount = new JLabel("de ");
        lblRowCount.setOpaque(false);
        pnlRow.add(lblRowCount);*/

        //pnl.add(pnlRow, BorderLayout.SOUTH);

        JPanel pnlControl = new JPanel();
        pnlControl.setLayout(new BorderLayout());
        pnlControl.setOpaque(false);
        pnlControl.setPreferredSize(new Dimension(150, 0));

        int an = 120, ha = 30, s = 10;

        JPanel pnlNorth = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 5));

        cbAdd = new JButton("Agregar", gif.ADD16);
        cbAdd.setPreferredSize(new Dimension(an, ha));
        cbAdd.setHorizontalAlignment(SwingConstants.LEFT);
        cbAdd.setMnemonic('A');
        cbAdd.addActionListener(this);
        cbAdd.setOpaque(false);
        cbAdd.setIconTextGap(s);
        if (swAdd) {
            pnlNorth.add(cbAdd);
        }
        cbModify = new JButton("Modificar", gif.MODIFY16);
        cbModify.setPreferredSize(new Dimension(an, ha));
        cbModify.setHorizontalAlignment(SwingConstants.LEFT);
        cbModify.setMnemonic('M');
        cbModify.addActionListener(this);
        cbModify.setOpaque(false);
        cbModify.setIconTextGap(s);
        if (swModify) {
            pnlNorth.add(cbModify);
        }
        cbEliminate = new JButton("Eliminar", gif.ELIMINATE16);
        cbEliminate.setPreferredSize(new Dimension(an, ha));
        cbEliminate.setHorizontalAlignment(SwingConstants.LEFT);
        cbEliminate.setMnemonic('E');
        cbEliminate.addActionListener(this);
        cbEliminate.setOpaque(false);
        cbEliminate.setIconTextGap(s);
        if (swEliminate) {
            pnlNorth.add(cbEliminate);
        }
        cbNullify = new JButton("Anular", gif.NULLIFY);
        cbNullify.setPreferredSize(new Dimension(an, ha));
        cbNullify.setHorizontalAlignment(SwingConstants.LEFT);
        cbNullify.setMnemonic('N');
        cbNullify.addActionListener(this);
        cbNullify.setOpaque(false);
        cbNullify.setIconTextGap(s);
        if (swNullify) {
            pnlNorth.add(cbNullify);
        }
        cbClone = new JButton("Clonar", gif.CLONE);
        cbClone.setPreferredSize(new Dimension(an, ha));
        cbClone.setHorizontalAlignment(SwingConstants.LEFT);
        cbClone.setMnemonic('N');
        cbClone.addActionListener(this);
        cbClone.setOpaque(false);
        cbClone.setIconTextGap(s);
        if (swClone) {
            pnlNorth.add(cbClone);
        }
        cbDetails = new JButton("Detalle", gif.DETAIL16);
        cbDetails.setPreferredSize(new Dimension(an, ha));
        cbDetails.setHorizontalAlignment(SwingConstants.LEFT);
        cbDetails.setMnemonic('Z');
        cbDetails.addActionListener(this);
        cbDetails.setOpaque(false);
        cbDetails.setIconTextGap(s);
        if (swDetails) {
            pnlNorth.add(cbDetails);
        }
        cbSearch = new JButton("Buscar", gif.SEARCH16);
        cbSearch.setPreferredSize(new Dimension(an, ha));
        cbSearch.setHorizontalAlignment(SwingConstants.LEFT);
        cbSearch.setMnemonic('B');
        cbSearch.addActionListener(this);
        cbSearch.setOpaque(false);
        cbSearch.setIconTextGap(s);
        if (swSearch) {
            pnlNorth.add(cbSearch);
        }
        cbReport = new JButton("Reporte", gif.REPORT16);
        cbReport.setPreferredSize(new Dimension(an, ha));
        cbReport.setHorizontalAlignment(SwingConstants.LEFT);
        cbReport.setMnemonic('R');
        cbReport.addActionListener(this);
        cbReport.setOpaque(false);
        cbReport.setIconTextGap(s);
        if (swReport) {
            pnlNorth.add(cbReport);
        }
        cbPrint = new JButton("Imprimir", gif.PRINT16);
        cbPrint.setPreferredSize(new Dimension(an, ha));
        cbPrint.setHorizontalAlignment(SwingConstants.LEFT);
        cbPrint.setMnemonic('I');
        cbPrint.addActionListener(this);
        cbPrint.setOpaque(false);
        cbPrint.setIconTextGap(s);
        if (swPrint) {
            pnlNorth.add(cbPrint);
        }
        cbPrintFast = new JButton("Imp. Directa", gif.PRINT16);
        cbPrintFast.setPreferredSize(new Dimension(an, ha));
        cbPrintFast.setHorizontalAlignment(SwingConstants.LEFT);
        cbPrintFast.setMnemonic('F');
        cbPrintFast.addActionListener(this);
        cbPrintFast.setOpaque(false);
        cbPrintFast.setIconTextGap(s);
        if (swPrintFast) {
            pnlNorth.add(cbPrintFast);
        }

        cbClose = new JButton("Cerrar", gif.EXIT16);
        cbClose.setPreferredSize(new Dimension(an, ha));
        cbClose.setHorizontalAlignment(SwingConstants.LEFT);
        cbClose.setMnemonic('S');
        cbClose.addActionListener(this);
        cbClose.setOpaque(false);
        cbClose.setIconTextGap(s);
        if (swClose) {
            pnlNorth.add(cbClose);
        }

        pnlControl.add(pnlNorth, BorderLayout.CENTER);

        JPanel pnlSouth = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 5));

        cbRefresh = new JButton("Refrescar", gif.REFRESH16);
        cbRefresh.setPreferredSize(new Dimension(an, ha));
        cbRefresh.setHorizontalAlignment(SwingConstants.LEFT);
        cbRefresh.setMnemonic('R');
        cbRefresh.addActionListener(this);
        cbRefresh.setOpaque(false);
        cbRefresh.setIconTextGap(s);
        if (swRefresh) {
            pnlSouth.add(cbRefresh);
        }

        pnlControl.add(pnlSouth, BorderLayout.SOUTH);

        pnl.add(pnlControl, BorderLayout.WEST);

        JPanel pnlaux = new JPanel(new BorderLayout());
        pnlaux.setLayout(new BorderLayout(0, 0));

        modeltable = new AduanaTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        
        table.getSelectionModel().addListSelectionListener(this);
        table.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == 127) {
                    //controlEliminate();
                } else {
                    e.getKeyCode();
                }
            }
        });

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    controlDetails();
                }
            }
        });

        scroll = new JScrollPane(table);

        pnlaux.add(scroll, BorderLayout.CENTER);
        pnl.add(pnlaux, BorderLayout.CENTER);

        lblTitle = new JLabel();
        lblTitle.setOpaque(true);
        lblTitle.setFont(new Font(lblTitle.getFont().getFontName(), 1, 14));
        lblTitle.setForeground(new Color(214, 223, 245));
        lblTitle.setBackground(new Color(117, 140, 220));
        lblTitle.setPreferredSize(new Dimension(0, 25));
        lblTitle.setBorder(new EmptyBorder(0, 10, 0, 0));
        pnl.add(lblTitle, BorderLayout.NORTH);

        pnlCardView.add("pnlPrincipal", pnl);
        setPanel(pnlCardView);
    }

    @Override
    public void cargarFiltro() {
    }

    @Override
    public void cargarTabla() {
        try {
            rn_Aduana regla = new rn_Aduana(path);
            modeltable.clearTable();
            modeltable.agregarVectoraduana(regla.listarGeneral());
            table.setAllColumnPreferredWidth();
            refresh();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void refresh() {
    }

    @Override
    public Object getSelectedValue(int column) {
        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

        return modeltable.getValueAt(realRowIndex, column);
    }

    @Override
    public void setTitle(String title, Icon icon) {
        lblTitle.setText(" " + title);
        lblTitle.setIcon(icon);
    }

    @Override
    public void controlPrint(boolean view) {
    }

    @Override
    public void refreshTitleName() {
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
    }

    @Override
    public void selectFirstRow() {
    }

    @Override
    public void selectPreviusRow() {
    }

    @Override
    public void selectNextRow() {
    }

    @Override
    public void selectLastRow() {
    }

    @Override
    public int getSelectedRow() {
        return -1;
    }

    @Override
    public int getRowCount() {
        return -1;
    }

    @Override
    public void setSelectedRow(int row) {
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
    }

    @Override
    public void controlReport(boolean export) {
        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Lista de Aduanas");
        ExportExcel.exportar(table, parameters);
    }

    @Override
    public void controlAdd() {
        if (register != null) {
            register.setPath(path);
            register.setModeRegister(Register.INSERT);
            register.showRegister();
        }
    }

    @Override
    public void controlModify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        if (register != null) {
            register.setPath(path);
            if (register.setModeRegister(Register.UPDATE)) {
                register.showRegister();
            } else {
                controlRefresh();
            }
        }
    }

    @Override
    public void controlEliminate() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        if (register != null) {
            register.setPath(path);
            if (register.setModeRegister(Register.DELETE)) {
                register.showRegister();
            } else {
                controlRefresh();
            }
        }
    }

    @Override
    public void controlDetails() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        if (register != null) {
            register.setPath(path);
            if (register.setModeRegister(Register.DETAIL)) {
                register.showRegister();
            } else {
                controlRefresh();
            }
        }
    }

    @Override
    public void controlSearch() {
    }

    @Override
    public void controlClose() {
        setVisible(false);
        dispose();
        doDefaultCloseAction();
    }

    @Override
    public void controlRefresh() {
        cargarTabla();
    }

    @Override
    public void controlNullify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        if (register != null) {
            register.setPath(path);
            if (register.setModeRegister(Register.ANULAR)) {
                register.showRegister();
            } else {
                controlRefresh();
            }
        }
    }

    @Override
    public void controlClone() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        if (register != null) {
            register.setPath(path);
            register.setModeRegister(Register.CLONE);
            register.showRegister();
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbFirst == e.getSource()) {
            selectFirstRow();
        }

        if (cbPrevius == e.getSource()) {
            selectPreviusRow();
        }

        if (cbNext == e.getSource()) {
            selectNextRow();
        }

        if (cbLast == e.getSource()) {
            selectLastRow();
        }

        if (cbAdd == e.getSource()) {
            controlAdd();
        }

        if (cbModify == e.getSource()) {
            controlModify();
        }

        if (cbEliminate == e.getSource()) {
            controlEliminate();
        }

        if (cbDetails == e.getSource()) {
            controlDetails();
        }

        if (cbSearch == e.getSource()) {
            controlSearch();
        }

        if (cbPrint == e.getSource()) {
            controlPrint(true);
        }

        if (cbClose == e.getSource()) {
            controlClose();
        }

        if (cbRefresh == e.getSource()) {
            controlRefresh();
        }

        if (cbPrintFast == e.getSource()) {
            controlPrint(false);
        }

        if (cbNullify == e.getSource()) {
            controlNullify();
        }

        if (cbClone == e.getSource()) {
            controlClone();
        }

        if (cbReport == e.getSource()) {
            controlReport(false);
        }
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void selectFirstPage() {
    }

    @Override
    public void selectPreviusPage() {
    }

    @Override
    public void selectNextPage() {
    }

    @Override
    public void selectLastPage() {
    }

    @Override
    public int getSelectedPage() {
        return 0;
    }

    @Override
    public int getPageCount() {
        return 0;
    }
}
